import * as fs from "fs";
import yargs from "yargs";
import { Importer } from "./analyze";
import { Project } from "ts-morph";

const importer = new Importer();

const argv = yargs
  .example(`ts-node src/ts2famix-tsconfig.ts -i ../path/to/project/tsconfig.json -o JSONModels/projectName.json`, 'creates a JSON-format model of a typescript project')
  .alias('i', 'input')
  .nargs('i', 1)
  .alias('o', 'output')
  .nargs('o', 1)
  .demandOption('input').demandOption('output').parseSync();

const tsConfigFilePath = argv.input as string;

const project = new Project({
  tsConfigFilePath
});  

const famixRep = importer.famixRepFromProject(project);
const jsonOutput = famixRep.getJSON();
const jsonFilePath = argv.output as string;

fs.writeFile(jsonFilePath, jsonOutput, (err) => {
  if (err) { throw err; }
});

console.info(`Created: ${jsonFilePath}`); 
