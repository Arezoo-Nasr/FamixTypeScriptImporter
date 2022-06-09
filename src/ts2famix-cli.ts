import * as fs from "fs"
import yargs from "yargs";
import { TS2Famix } from "./ts2famix";

const argv = yargs
    .example('$0 -i ../myTypescriptProject -o myTypeScriptProject.json', 'creates JSON-format model of typescript project')
    .alias('i', 'input')
    .nargs('i', 1)
    .alias('o', 'output')
    .nargs('o', 1)
    .demandOption('input').demandOption('output').argv;

const importer = new TS2Famix();
const paths = new Array<string>();
paths.push(argv.input as string);

const fmxRep2 = importer.famixRepFromPath(paths);
const jsonOutput = fmxRep2.getJSON();
const jsonFilePath = argv.output as string;

fs.writeFile(jsonFilePath, jsonOutput, (err) => {
    if (err) { throw err; }
});
console.info(`created ${jsonFilePath}`); 
