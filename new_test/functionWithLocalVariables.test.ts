
import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Function } from "../src/lib/famix/src/model/famix/function";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource('function fct() : number {\n\
    let i : number;\n\
    const x : string; \n\
    return 0;\n\
}\n\
');


describe('Tests for simple function', () => {
    
    const theFunction = Array.from( fmxRep._getAllEntitiesWithType('Function') )[0] as Function;
    it("should have two local variables", () => {
        expect(theFunction?.getLocalVariables().size).toBe(2);
    });

    const firstVariable = Array.from(theFunction?.getLocalVariables()).find( (p) => p.getName() == "i");
    it("should have a local variable 'i'", () => {
        expect(firstVariable).toBeTruthy();
    });
    it("should be of type number", () => {
        expect(firstVariable?.getDeclaredType().getName()).toBe("number");
    });

    const secondVariable = Array.from(theFunction?.getLocalVariables()).find( (p) => p.getName() == "x");
    it("should have a local variable 'x'", () => {
        expect(secondVariable).toBeTruthy();
    });
    it("should be of type string", () => {
        expect(secondVariable?.getDeclaredType().getName()).toBe("string");
    });

});
