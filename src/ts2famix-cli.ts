import * as fs from "fs";
import yargs from "yargs";
import { Importer } from './analyze';

const importer = new Importer();

const argv = yargs
    .example(`ts-node src/ts2famix-cli.ts -i "../path/to/project/**/*.ts" -o JSONModels/projectName.json`, 'creates a JSON-format model of a typescript project')
    .alias('i', 'input')
    .nargs('i', 1)
    .alias('o', 'output')
    .nargs('o', 1)
    .demandOption('input').demandOption('output').parseSync();

const paths = new Array<string>();
paths.push(argv.input as string);

const famixRep = importer.famixRepFromPaths(paths);
const jsonOutput = famixRep.getJSON();
const jsonFilePath = argv.output as string;

fs.writeFile(jsonFilePath, jsonOutput, (err) => {
    if (err) { throw err; }
});

console.info(`Created: ${jsonFilePath}`); 
