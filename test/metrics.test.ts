import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["test_src/ForMetrics.ts"];
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPaths(filePaths);
const jsonOutput = fmxRep2.getJSON();
const parsedModel = JSON.parse(jsonOutput);

describe('Metrics', () => {

    it("should calculate cyclomatic complexity", () => {
        let theMethod = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Method" && el.name === "methodCyclomaticOne"))[0];
        expect(theMethod).toBeTruthy();
        expect(theMethod.cyclomaticComplexity).toBe(1);
        theMethod = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Method" && el.name === "methodCyclomaticFour"))[0];
        expect(theMethod).toBeTruthy();
        expect(theMethod.cyclomaticComplexity).toBe(4);
    });
});
