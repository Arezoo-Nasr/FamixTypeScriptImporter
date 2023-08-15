import { Importer } from '../src/analyze';
import { Function } from "../src/lib/famix/src/model/famix/function";
import { VariableStatement } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("functionWithVariables", 
    'function fct(): number {\n\
    let i: number, j: number;\n\
    const x: string = ""; \n\
    return 0;\n\
}\n\
');

describe('Tests for simple function with variables', () => {
    
    const theFunction = Array.from(fmxRep._getAllEntitiesWithType('Function'))[0] as Function;
    it("should have two variable statements", () => {
        expect(Array.from(theFunction?.getTypes()).filter(t => t instanceof VariableStatement).length).toBe(2);
    });

    const theVarS1 = Array.from(theFunction?.getTypes()).filter(t => t instanceof VariableStatement)[0] as VariableStatement;
    it("should have two variables in the first variable statement", () => {
        expect(theVarS1?.getVariables().size).toBe(2);
    });

    const theVarS2 = Array.from(theFunction?.getTypes()).filter(t => t instanceof VariableStatement)[1] as VariableStatement;
    it("should have one variable in the second variable statement", () => {
        expect(theVarS2?.getVariables().size).toBe(1);
    });

    const firstVariable = Array.from(theVarS1?.getVariables()).find((p) => p.getName() === "i");
    it("should have a variable 'i'", () => {
        expect(firstVariable).toBeTruthy();
    });

    it("should be of type number", () => {
        expect(firstVariable?.getDeclaredType().getName()).toBe("number");
    });

    const secondVariable = Array.from(theVarS1?.getVariables()).find((p) => p.getName() === "j");
    it("should have a variable 'j'", () => {
        expect(secondVariable).toBeTruthy();
    });
    
    it("should be of type number", () => {
        expect(secondVariable?.getDeclaredType().getName()).toBe("number");
    });

    const thirdVariable = Array.from(theVarS2?.getVariables()).find((p) => p.getName() === "x");
    it("should have a variable 'x'", () => {
        expect(thirdVariable).toBeTruthy();
    });

    it("should be of type string", () => {
        expect(thirdVariable?.getDeclaredType().getName()).toBe("string");
    });
});
