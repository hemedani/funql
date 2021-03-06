import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";
import Select from "react-select";
import Code from "./code.svg";
import Doc from "./component/Doc";
import { makeObjectData } from "./component/function";
import InputTextarea from "./component/InputTextarea";
import { Logo } from "./component/Logo";
import Setting from "./component/Seteting";
import Show from "./component/Show";
import SwitchContent from "./component/Switch";
import OrgChartTree from "./component/Test";
import graph from "./flow-chart.svg";
import Play from "./playbutton.png";
import "./styles/globals.css";
import { customStyles } from "./styles/reactSelectStyle";
import {
  Bottom,
  BoxParagraphHeader,
  BoxPlayGround,
  BoxShow,
  ButtonPaly,
  Container,
  IconBottomLeft,
  IconBottomRight,
  IconPlay,
  Left,
  LeftBottom,
  ParagraphHeader,
  Right,
  RightBottom,
} from "./styles/styled";
import test from "./test.svg";
import Website from "./website.svg";
interface Props {}
interface SelectOptions {
  value: string;
  label: string;
}
const App: React.FC<Props> = () => {
  const [models, setModels] = useState<SelectOptions | null>(null); //this state is for react-select models management
  const [doits, setDoits] = useState<SelectOptions | null>(null); //this state is for react-select doits management
  const [fileChange, setFileChange] = useState<string>(""); //this state is for read file when user input the schema file
  const [result, setResult] = useState<string>(""); //this state is for displaying the request result
  const [port, setPort] = useState<string>(""); //this state is for specifying the port to request server
  const [header, setHeader] = useState<string>(""); //this state is for specifying the port to request server
  const [setting, setSetting] = useState(false);
  const [isStatic, setIsStatic] = useState<boolean>(false); //this state is for react-select models management
  const [isTextarea, setIsTextarea] = useState<boolean>(false); //this state is for react-select models management
  const [collapse, setCollapse] = useState<[boolean, boolean]>([false, false]);

  //this variable for set json schema
  let dataSchemaDynamic: any = [];
  let dataSchemaStatic: any = [];
  //this variables for options react-select
  let optionStaticModels: SelectOptions[] = [];
  let optionStaticDoits: SelectOptions[] = [];
  let optionDynamicModels: SelectOptions[] = [];
  let optionDynamicDoits: SelectOptions[] = [];
  //this condition for check user input file json
  // convert value text file to json then set options for react-select
  if (fileChange) {
    dataSchemaDynamic =
      JSON.parse(fileChange).schema.props.contents.props.dynamic.props.models
        .props;
    dataSchemaStatic =
      JSON.parse(fileChange).schema.props.contents.props.static.props.models
        .props;
    if (isStatic) {
      Object.keys(dataSchemaStatic).map((key: string) =>
        optionStaticModels.push({ value: key, label: key })
      );
    } else {
      Object.keys(dataSchemaDynamic).map((key: string) =>
        optionDynamicModels.push({ value: key, label: key })
      );
    }

    if (models !== null) {
      isStatic
        ? Object.keys(dataSchemaStatic[models.value].props.doits.props).map(
            (key) => {
              return optionStaticDoits.push({ value: key, label: key });
            }
          )
        : Object.keys(dataSchemaDynamic[models.value].props.doits.props).map(
            (key) => {
              return optionDynamicDoits.push({ value: key, label: key });
            }
          );
    }
  }

  //when change models cleanup register input react-hook-form
  useEffect(() => {
    return () => {
      Object.keys(watch()).map((key) => unregister(key));
    };
  }, [models]);

  const {
    register,
    handleSubmit,
    watch,
    unregister,
    reset,
    formState: { errors },
  } = useForm({
    //use resolver for validation values but now not working validation and will be developed in the future
    resolver: async (data: any) => {
      return {
        values: data,
        errors: {},
      };
    },
  });

  const onSubmit = (data: any) => {
    let dataCustom = makeObjectData(data);

    console.log(
      {
        contents: isStatic ? "static" : "dynamic",
        details: dataCustom,
        wants: {
          model: models ? models.value : "",
          doit: doits ? doits.value : "",
        },
      },
      "dat"
    );
    const link = port
      ? `http://127.0.0.1:${port}/funql`
      : `http://127.0.0.1:6005/funql`;
    axios
      .post(
        link,
        {
          contents: isStatic ? "static" : "dynamic",
          details: dataCustom,
          wants: {
            model: models ? models.value : "",
            doit: doits ? doits.value : "",
          },
        },
        { headers: header }
      )
      .then(function (response) {
        setResult(JSON.stringify(response.data.body));
      })
      .catch(function (error) {
        console.log(error.response, "err");
        // error && setResult("you have errors");
        error &&
          error.response &&
          setResult(JSON.stringify(error.response.data));
      });
  };

  const [graphPage, setGraphPage] = useState(false);
  return (
    <Container onSubmit={handleSubmit(onSubmit)}>
      {graphPage ? (
        <OrgChartTree
          data={fileChange ? JSON.parse(fileChange) : ""}
          setGraphPage={setGraphPage}
        />
      ) : (
        <>
          <Left>
            <BoxParagraphHeader>
              <ParagraphHeader>
                <p style={{ margin: "0" }}>Details</p>
                {isTextarea ? (
                  <img
                    onClick={() => setIsTextarea(!isTextarea)}
                    style={{ cursor: "pointer", width: "1rem", height: "1rem" }}
                    src={Code}
                  />
                ) : (
                  <img
                    onClick={() => setIsTextarea(!isTextarea)}
                    style={{ cursor: "pointer", width: "1rem", height: "1rem" }}
                    src={Website}
                  />
                )}
              </ParagraphHeader>
            </BoxParagraphHeader>
            <BoxPlayGround>
              {isTextarea ? (
                <InputTextarea
                  doit={doits ? doits.value : ""}
                  isStatic={isStatic}
                  model={models ? models.value : ""}
                  watch={watch}
                />
              ) : (
                models !== null &&
                doits !== null &&
                Object.keys(
                  isStatic
                    ? dataSchemaStatic[models.value].props.doits.props[
                        doits.value
                      ].props.details.props
                    : dataSchemaDynamic[models.value].props.doits.props[
                        doits.value
                      ].props.details.props
                ).map((key, index) => (
                  <BoxShow key={key + index}>
                    <p
                      style={{
                        display: "flex",
                        minWidth: "4rem",
                        backgroundColor: "rgb(24,37,46)",
                        padding: "1rem",
                        borderRadius: "0.4rem",
                        marginTop: "1.5rem",
                        marginBottom: "0.3rem",
                        border: "1px solid rgb(237,41,96)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          marginRight: "0.5rem",
                          cursor: "pointer",
                          marginTop: "-0.3rem",
                        }}
                        onClick={() =>
                          index === 1
                            ? setCollapse([collapse[0], !collapse[1]])
                            : setCollapse([!collapse[0], collapse[1]])
                        }
                      >
                        {collapse[index] ? "-" : "+"}
                      </span>
                      {key}
                    </p>
                    <div
                      style={
                        collapse[index]
                          ? { display: "none" }
                          : { display: "block" }
                      }
                    >
                      <Show
                        register={register}
                        ke={key}
                        key={key}
                        mainkey={key}
                        index={0}
                        value={""}
                        values={
                          isStatic
                            ? dataSchemaStatic[models.value].props.doits.props[
                                doits.value
                              ].props.details.props[key]
                            : dataSchemaDynamic[models.value].props.doits.props[
                                doits.value
                              ].props.details.props[key]
                        }
                      />
                    </div>
                  </BoxShow>
                ))
              )}
            </BoxPlayGround>
          </Left>
          <Right>
            <BoxParagraphHeader>
              <ParagraphHeader>Response</ParagraphHeader>
            </BoxParagraphHeader>
            <BoxPlayGround style={{ padding: 0 }}>
              <JSONPretty id="json-pretty" data={result}></JSONPretty>
            </BoxPlayGround>
          </Right>

          <Bottom>
            <LeftBottom>
              <IconBottomRight>
                <Doc
                  setHeader={setHeader}
                  setting={setting}
                  setSetting={setSetting}
                  setFileChange={setFileChange}
                  setPort={setPort}
                />
              </IconBottomRight>
              <div
                style={{
                  width: "4rem",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRight: "0.1rem solid",
                }}
              >
                <img
                  src={graph}
                  onClick={() => setGraphPage(true)}
                  style={{
                    height: "2.5rem",
                    padding: "0.5rem",
                    width: "2.5rem",
                  }}
                />
              </div>

              <div
                style={{
                  flex: "1",
                  alignItems: "center",
                  height: "50%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {(dataSchemaDynamic || dataSchemaStatic) && (
                  <Select
                    menuPlacement="auto"
                    styles={customStyles}
                    height={"2rem"}
                    id="models"
                    placeholder={"Models"}
                    width="230px"
                    // value={Models.value}
                    onChange={(value: any) => {
                      setModels(value);
                      setDoits(null);
                      reset();
                    }}
                    value={models}
                    options={
                      isStatic ? optionStaticModels : optionDynamicModels
                    }
                  />
                )}
                <SwitchContent
                  fn={() => {
                    setModels(null);
                    reset();
                    setDoits(null);
                  }}
                  value={["static", "dynamic"]}
                  switchBool={isStatic}
                  setSwitchBool={setIsStatic}
                />
              </div>
            </LeftBottom>

            <Logo size={"3.5rem"} />

            <RightBottom>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Select
                  id="doits"
                  placeholder={"Doits"}
                  menuPlacement="auto"
                  value={doits}
                  height={"2rem"}
                  styles={customStyles}
                  onChange={(value) => {
                    setDoits(value);
                    reset();
                  }}
                  width="230px"
                  options={isStatic ? optionStaticDoits : optionDynamicDoits}
                />
                <ButtonPaly onClick={handleSubmit(onSubmit)}>
                  <IconPlay src={Play} />
                </ButtonPaly>
              </div>

              <div
                style={{
                  width: "4rem",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderLeft: "0.1rem solid",
                }}
              >
                <img
                  src={test}
                  style={{
                    height: "2.5rem",
                    padding: "0.5rem",
                    width: "2.5rem",
                  }}
                />
              </div>
              <IconBottomLeft>
                <Setting
                  setHeader={setHeader}
                  setting={setting}
                  setSetting={setSetting}
                  setFileChange={setFileChange}
                  setPort={setPort}
                />
              </IconBottomLeft>
            </RightBottom>
          </Bottom>
          <div
            onClick={() => setSetting(false)}
            className={setting ? "darkcontaineropen" : "darkcontainerclose"}
          ></div>
        </>
      )}
    </Container>
  );
};

export default App;
