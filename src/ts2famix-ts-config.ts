import * as fs from "fs"
// import yargs from "yargs";
import { TS2Famix } from "./ts2famix";
import * as ts from "typescript";
import { Project } from "ts-morph";

// const argv = yargs
//     .example('$0 -i ../myTypescriptProject -o myTypeScriptProject.json', 'creates JSON-format model of typescript project')
//     .alias('i', 'input')
//     .nargs('i', 1)
//     .alias('o', 'output')
//     .nargs('o', 1)
//     .demandOption('input').demandOption('output').parseSync();

const importer = new TS2Famix();
// const paths = new Array<string>();
// paths.push(argv.input as string);

const tsConfigFilePath = "../Emojiopoly/tsconfig.json";
const tsConfig = ts.readConfigFile(tsConfigFilePath, ts.sys.readFile).config;

const project = new Project({
    tsConfigFilePath,
    // compilerOptions: tsConfig.compilerOptions,
  });  

const fmxRep2 = importer.famixRepFromProject(project);
const jsonOutput = fmxRep2.getJSON();
// const jsonFilePath = argv.output as string;

// fs.writeFile(jsonFilePath, jsonOutput, (err) => {
//     if (err) { throw err; }
// });
// console.info(`created ${jsonFilePath}`); 
console.log(jsonOutput);