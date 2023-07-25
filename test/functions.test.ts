//import { TS2Famix } from "../src/ts2famix";
import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["test_src/functions/*.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPaths(filePaths);

describe('Functions', () => {

    it("should contain function 'a' in '__global'", () => {
        const moduleName = "__global";
        const functionName = "a";
        const theFunction = fmxRep2._getFamixFunction(functionName);
        expect(theFunction).toBeTruthy();
        if (theFunction) {
        }
    })

    it("should contain function 'b' in '__global'", () => {
        const moduleName = "__global";
        const functionName = "b";
        const functionNameRegEx = 'test_src\\/functions\\/function-import"\\.b';
        const theFunction = fmxRep2._getFamixFunction(functionName);
        // "C:/Users/fuhrm/Documents/GitHub/FamixTypeScriptImporter/test_src/functions/function-import";
        expect(theFunction).toBeTruthy();
        if (theFunction) {
        }
    })

})
