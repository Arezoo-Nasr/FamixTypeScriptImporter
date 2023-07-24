//import { TS2Famix } from '../src/ts2famix';
import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Method } from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/ForMetrics.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();
let parsedModel = JSON.parse(jsonOutput);

describe('ts2famix', () => {

    it("should calculate cyclomatic complexity", () => {
        let theMethod = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Method" && el.name == "methodCyclomaticOne"))[0];
        expect(theMethod).toBeTruthy();
        expect(theMethod.cyclomaticComplexity).toBe(1);

        theMethod = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Method" && el.name == "methodCyclomaticFour"))[0];
        expect(theMethod).toBeTruthy();
        expect(theMethod.cyclomaticComplexity).toBe(4);
    });
});
