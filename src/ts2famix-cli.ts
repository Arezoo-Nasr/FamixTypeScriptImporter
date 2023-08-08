import * as fs from "fs";
import yargs from "yargs";
import { Importer } from './analyze';

const importer = new Importer();

const argv = yargs
    .example('$0 -i ../myTypescriptProject -o myTypeScriptProject.json', 'creates JSON-format model of typescript project')
    .alias('i', 'input')
    .nargs('i', 1)
    .alias('o', 'output')
    .nargs('o', 1)
    .demandOption('input').demandOption('output').parseSync();

const paths = new Array<string>();
paths.push(argv.input as string);

const fmxRep = importer.famixRepFromPaths(paths);
const jsonOutput = fmxRep.getJSON();
const jsonFilePath = argv.output as string;

fs.writeFile(jsonFilePath, jsonOutput, (err) => {
    if (err) { throw err; }
});

console.info(`Created: ${jsonFilePath}`); 
