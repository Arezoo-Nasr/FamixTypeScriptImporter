import { Importer } from '../src/analyze';
import { Function } from "../src/lib/famix/src/model/famix/function";
import { Comment } from '../src/lib/famix/src/model/famix/comment';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("functionWithVariables", 
    'function fct(): number {\n\
    // comment 1\n\
    let i: number /*comment 2*/, j: number; // comment 3\n\
    const x: string = "";\n\
    return 0;\n\
}\n\
');

describe('Tests for function with variables', () => {
    
    const theFunction = Array.from(fmxRep._getAllEntitiesWithType('Function'))[0] as Function;
    it("should have three variables", () => {
        expect(theFunction?.getVariables().size).toBe(3);
    });

    const firstVariable = Array.from(theFunction?.getVariables()).find((p) => p.getName() === "i");
    it("should have a variable 'i' with three comments", () => {
        expect(firstVariable).toBeTruthy();
        expect(firstVariable?.getParentContainerEntity()).toBe(theFunction);
        expect(firstVariable?.getComments().size).toBe(3);
        expect(Array.from(firstVariable?.getComments() as Set<Comment>)[0]?.getContent()).toBe("/*comment 2*/");
        expect(Array.from(firstVariable?.getComments() as Set<Comment>)[1]?.getContent()).toBe("// comment 1");
        expect(Array.from(firstVariable?.getComments() as Set<Comment>)[2]?.getContent()).toBe("// comment 3");
        expect(Array.from(firstVariable?.getComments() as Set<Comment>)[0]?.getContainer()).toBe(firstVariable);
        expect(Array.from(firstVariable?.getComments() as Set<Comment>)[1]?.getContainer()).toBe(firstVariable);
        expect(Array.from(firstVariable?.getComments() as Set<Comment>)[2]?.getContainer()).toBe(firstVariable);
    });

    it("should be of type number", () => {
        expect(firstVariable?.getDeclaredType().getName()).toBe("number");
    });

    const secondVariable = Array.from(theFunction?.getVariables()).find((p) => p.getName() === "j");
    it("should have a variable 'j' with two comments", () => {
        expect(secondVariable).toBeTruthy();
        expect(secondVariable?.getParentContainerEntity()).toBe(theFunction);
        expect(secondVariable?.getComments().size).toBe(2);
        expect(Array.from(secondVariable?.getComments() as Set<Comment>)[0]?.getContent()).toBe("// comment 1");
        expect(Array.from(secondVariable?.getComments() as Set<Comment>)[1]?.getContent()).toBe("// comment 3");
        expect(Array.from(secondVariable?.getComments() as Set<Comment>)[0]?.getContainer()).toBe(secondVariable);
        expect(Array.from(secondVariable?.getComments() as Set<Comment>)[1]?.getContainer()).toBe(secondVariable);
    });
    
    it("should be of type number", () => {
        expect(secondVariable?.getDeclaredType().getName()).toBe("number");
    });

    const thirdVariable = Array.from(theFunction?.getVariables()).find((p) => p.getName() === "x");
    it("should have a variable 'x'", () => {
        expect(thirdVariable).toBeTruthy();
        expect(thirdVariable?.getParentContainerEntity()).toBe(theFunction);
    });

    it("should be of type string", () => {
        expect(thirdVariable?.getDeclaredType().getName()).toBe("string");
    });
});
