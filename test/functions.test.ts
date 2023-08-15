import { Importer } from '../src/analyze';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("functions", 
    'function a() {}\n\
function b() {}\n\
');

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
