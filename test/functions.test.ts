import { Project } from 'ts-morph';
import { Importer } from '../src/analyze';

const importer = new Importer();
const project = new Project();
project.createSourceFile("functions.ts",
`function a() {}
function b() {}
`);

const fmxRep = importer.famixRepFromProject(project);

describe('Functions', () => {

    it("should contain function 'a'", () => {
        const functionName = "a";
        const theFunction = fmxRep._getFamixFunction(functionName);
        expect(theFunction).toBeTruthy();
    });

    it("should contain function 'b'", () => {
        const functionName = "b";
        const theFunction = fmxRep._getFamixFunction(functionName);
        expect(theFunction).toBeTruthy();
    });
});
