import {
  SourceFile,
  SyntaxKind,
  log,
  Node,
  TypeReferenceNode,
} from "../../../deps.ts";
import {
  getInterfaceFromType,
  getEnumFromType,
  getTypeAliasFromType,
} from "./ts-morph/mod.ts";
import { addFunQLInterfaceToSourceFile } from "./addInterfaceToSrcFile.ts";
import { addFunQLEnumToSourceFile } from "./mod.ts";
import { isInternalType } from "./isTypeInternal.ts";
import { addFunQLAliasTypeToSourceFile } from "./addTypeAliasToSrcFile.ts";

/**
 * @function
 * find and add associated declaration to this type to source file
 * @param type
 * @param createdSourceFile
 * @todo handle type alias type
 */
export function addNodeInnerTypeToSrcFile(
  node: Node,
  createdSourceFile: SourceFile,
  options: { type?: "dynamic" | "static" | "response" } = { type: "dynamic" }
) {
  //extract options
  const { type } = options;
  //gets all type references in descendants
  const typeReferences = node.getDescendantsOfKind(SyntaxKind.TypeReference);
  //adds own node if type of node is type reference
  node.getKind() === SyntaxKind.TypeReference &&
    typeReferences.push(<TypeReferenceNode>node);

  typeReferences.map((reference) => {
    try {
      //get type of references
      const typeOfReference = reference.getType();
      //checks type is internal or not supported
      if (
        isInternalType(reference.getText()) ||
        isInternalType(typeOfReference.getText())
      ) {
        return;
      }
      //if type is interface we should find interface and process it again
      if (typeOfReference.isInterface()) {
        const foundedInterface = getInterfaceFromType(typeOfReference);
        addFunQLInterfaceToSourceFile(foundedInterface, createdSourceFile, {
          type,
        });
        return;
      }
      //if type is enum we should find enum and add it to source file
      else if (typeOfReference.isEnum()) {
        const foundedEnum = getEnumFromType(typeOfReference);
        addFunQLEnumToSourceFile(foundedEnum, createdSourceFile, { type });
        return;
        //this type is type alias
      } else if (typeOfReference.isObject()) {
        const foundedTypeAlias = getTypeAliasFromType(typeOfReference);
        addFunQLAliasTypeToSourceFile(foundedTypeAlias, createdSourceFile, {
          type,
        });
      } else {
        /*else if(){} */
        throw Error(
          "please use only interface and enum types for your type referencing type is supported incompletely"
        );
      }
    } catch (error) {
      log.error(
        `we have some problem in finding type: '${reference.getText()}' in file: ${reference
          .getSourceFile()
          .getBaseName()} 
          ${error}
        `
      );
    }
  });
}
