import { parse } from "https://deno.land/std/flags/mod.ts";
import { copy, ensureDir, exists } from "https://deno.land/std/fs/mod.ts";
import { createBlog } from "./blog/index.ts";
import "./config/mod.ts";
import { upgrade } from "./cli/mod.ts";
import { generateDeclarations } from "./declarations/mod.ts";
import { runHelp } from "./help.ts";
import { generatePlay } from "./play/generatePlay.ts";
import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";

export interface CommandArgs {
  init?: boolean | string;
  declaration?: boolean | "schema" | "request" | "response";
  upgrade?: string;
  gs?: string;
  _: (string | number)[];
  play?: boolean;
  help?: boolean;
}

const args: CommandArgs = parse(Deno.args);

const createProject = async (init: string | boolean) => {
  init === true && (init = "funql");
  await ensureDir(`./${init}`);
  await createBlog(`./${init}`);
};

const runPlayground = async () => {
  const app = new Application();

  const play = await exists("./.play");

  play && (await Deno.remove("./.play", { recursive: true }));

  await generatePlay();

  console.log(" Playgroud start at http://localhost:1366/ ");
  app
    .static("/", "./.play")
    .file("/", "./.play/index.html")
    .start({ port: 1366 });
};

args.init && (await createProject(args.init));

args.declaration && (await generateDeclarations(args));

args.help && runHelp();
args.play && (await runPlayground());
args.help && runHelp();

args.upgrade && (await upgrade(args.upgrade));
