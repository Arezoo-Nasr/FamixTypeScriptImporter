#!/usr/bin/env node
import * as fs from "fs";
import yargs from "yargs";
import { Importer } from './analyze';
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { Project } from "ts-morph";

const argv = yargs
    .example(`ts2famix -i "path/to/project/**/*.ts" -o JSONModels/projectName.json`, 'Creates a JSON-format Famix model of typescript files.')
    .example(`ts2famix -i path/to/tsconfig.json -o JSONModels/projectName.json`, 'Creates a JSON-format model of a typescript project.')
    .alias('i', 'input')
    .nargs('i', 1)
    .alias('o', 'output')
    .nargs('o', 1)
    .demandOption('input').demandOption('output').parseSync();

const importer = new Importer();
let famixRep: FamixRepository;

if ((argv.input as string).endsWith('tsconfig.json')) {
    const tsConfigFilePath = argv.input as string;
    const project = new Project({
        tsConfigFilePath
      }); 
    famixRep = importer.famixRepFromProject(project);
} else {
    const paths = new Array<string>();
    paths.push(argv.input as string);
    famixRep = importer.famixRepFromPaths(paths);
}

const jsonOutput = famixRep.getJSON();
const jsonFilePath = argv.output as string;

fs.writeFile(jsonFilePath, jsonOutput, (err) => {
    if (err) { throw err; }
});

console.info(`Created: ${jsonFilePath}`); 
