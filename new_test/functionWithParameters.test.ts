import { Importer } from '../src/analyze';
import { Function } from "../src/lib/famix/src/model/famix/function";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("functionWithParameters", 
    'function fct(i: number, x: string): number {\n\
    return 0;\n\
}\n\
');

describe('Tests for simple function with parameters', () => {
    
    const theFunction = Array.from(fmxRep._getAllEntitiesWithType('Function'))[0] as Function;
    it("should have two parameters", () => {
        expect(theFunction?.getParameters().size).toBe(2);
    });

    const firstParam = Array.from(theFunction?.getParameters()).find( (p) => p.getName() === "i");
    it("should have a parameter 'i'", () => {
        expect(firstParam).toBeTruthy();
    });

    it("should be of type number", () => {
        expect(firstParam?.getDeclaredType().getName()).toBe("number");
    });

    const secondParam = Array.from(theFunction?.getParameters()).find( (p) => p.getName() === "x");
    it("should have a parameter 'x'", () => {
        expect(secondParam).toBeTruthy();
    });

    it("should be of type string", () => {
        expect(secondParam?.getDeclaredType().getName()).toBe("string");
    });
});
