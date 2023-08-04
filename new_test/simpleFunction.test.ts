import { Importer } from '../src/new-parsing-strategy/analyze';
import { Function } from "../src/lib/famix/src/model/famix/function";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("simpleFunction", 
    'function fct(): number {\n\
    return 0;\n\
}\n\
');

describe('Tests for simple function', () => {
    
    const functionList = fmxRep._getAllEntitiesWithType('Function');
    it("should have one function", () => {
        expect(functionList?.size).toBe(1);
    });

    const theFunction = Array.from(functionList)[0] as Function;
    it("should contain a function 'fct'", () => {
        expect(theFunction).toBeTruthy();
        expect(theFunction?.getName()).toBe('fct');
    });

    it("should return number", () => {
        expect(theFunction?.getDeclaredType().getName()).toBe("number");
    });

    it("should have no parameter", () => {
        expect(theFunction?.getParameters().size).toBe(0);
    });
});
