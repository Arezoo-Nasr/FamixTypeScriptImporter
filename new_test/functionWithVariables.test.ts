import { Importer } from '../src/analyze';
import { Function } from "../src/lib/famix/src/model/famix/function";
import { VariableStatement } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("functionWithVariables", 
    'function fct(): number {\n\
    let i: number, j: number;\n\
    const x: string = "";\n\
    return 0;\n\
}\n\
');

describe('Tests for function with variables', () => {
    
    const theFunction = Array.from(fmxRep._getAllEntitiesWithType('Function'))[0] as Function;
    it("should have two variable statements and three variables", () => {
        expect(Array.from(theFunction?.getTypes()).filter(t => t instanceof VariableStatement).length).toBe(2);
        expect(theFunction?.getVariables().size).toBe(3);
    });

    const theVarS1 = Array.from(theFunction?.getTypes()).filter(t => t instanceof VariableStatement)[0] as VariableStatement;
    it("should have two variables in the first variable statement", () => {
        expect(theVarS1?.getVariablesInStatement().size).toBe(2);
        expect(theVarS1?.getParentContainerEntity()).toBe(theFunction);
        expect(theVarS1?.getVariables().size).toBe(0);
    });

    const theVarS2 = Array.from(theFunction?.getTypes()).filter(t => t instanceof VariableStatement)[1] as VariableStatement;
    it("should have one variable in the second variable statement", () => {
        expect(theVarS2?.getVariablesInStatement().size).toBe(1);
        expect(theVarS2?.getParentContainerEntity()).toBe(theFunction);
        expect(theVarS2?.getVariables().size).toBe(0);
    });

    const firstVariable = Array.from(theVarS1?.getVariablesInStatement()).find((p) => p.getName() === "i");
    const firstVariable2 = Array.from(theFunction?.getVariables()).find((p) => p.getName() === "i");
    it("should have a variable 'i'", () => {
        expect(firstVariable).toBeTruthy();
        expect(firstVariable2).toBe(firstVariable);
        expect(firstVariable?.getParentEntity()).toBe(theVarS1);
        expect(firstVariable?.getParentContainerEntity()).toBe(theFunction);
    });

    it("should be of type number", () => {
        expect(firstVariable?.getDeclaredType().getName()).toBe("number");
    });

    const secondVariable = Array.from(theVarS1?.getVariablesInStatement()).find((p) => p.getName() === "j");
    const secondVariable2 = Array.from(theFunction?.getVariables()).find((p) => p.getName() === "j");
    it("should have a variable 'j'", () => {
        expect(secondVariable).toBeTruthy();
        expect(secondVariable2).toBe(secondVariable);
        expect(secondVariable?.getParentEntity()).toBe(theVarS1);
        expect(secondVariable?.getParentContainerEntity()).toBe(theFunction);
    });
    
    it("should be of type number", () => {
        expect(secondVariable?.getDeclaredType().getName()).toBe("number");
    });

    const thirdVariable = Array.from(theVarS2?.getVariablesInStatement()).find((p) => p.getName() === "x");
    const thirdVariable2 = Array.from(theFunction?.getVariables()).find((p) => p.getName() === "x");
    it("should have a variable 'x'", () => {
        expect(thirdVariable).toBeTruthy();
        expect(thirdVariable2).toBe(thirdVariable);
        expect(thirdVariable?.getParentEntity()).toBe(theVarS2);
        expect(thirdVariable?.getParentContainerEntity()).toBe(theFunction);
    });

    it("should be of type string", () => {
        expect(thirdVariable?.getDeclaredType().getName()).toBe("string");
    });
});
