import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["test_src/functions/*.ts"];
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPaths(filePaths);

describe('Functions', () => {

    it("should contain function 'a' in '__global'", () => {
        const functionName = "a";
        const theFunction = fmxRep2._getFamixFunction(functionName);
        expect(theFunction).toBeTruthy();
    });

    it("should contain function 'b' in '__global'", () => {
        const functionName = "b";
        const theFunction = fmxRep2._getFamixFunction(functionName);
        expect(theFunction).toBeTruthy();
    });
});
