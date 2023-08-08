import * as fs from "fs";
import { Importer } from "./analyze";
import { Project } from "ts-morph";

const importer = new Importer();

const tsConfigFilePath = "../../Emojiopoly/tsconfig.json";

const project = new Project({
  tsConfigFilePath
});  

const fmxRep = importer.famixRepFromProject(project);
const jsonOutput = fmxRep.getJSON();
const jsonFilePath = "./JSONModels/Emojiopoly_model.json";

fs.writeFile(jsonFilePath, jsonOutput, (err) => {
  if (err) { throw err; }
});

console.info(`Created: ${jsonFilePath}`); 
