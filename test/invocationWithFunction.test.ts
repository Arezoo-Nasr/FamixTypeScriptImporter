import { Importer } from '../src/analyze';
import { Function } from "../src/lib/famix/src/model/famix/function";
import { Variable } from "../src/lib/famix/src/model/famix/variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("invocationWithFunction", 
    'function func(): void {}\n\
\n\
const x1 = func();\n\
');

describe('Tests for invocation with function', () => {
    
    it("should contain a variable 'x1'", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("Variable") as Set<Variable>);
        expect(pList).toBeTruthy();
        const x1 = pList.find(p => p.getName() === "x1");
        expect(x1).toBeTruthy();
    });
    
    const theFunction = fmxRep._getFamixFunction("func") as Function;
    const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
    
    it("should contain one invocation", () => {
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
    });

    it("should contain an invocation for 'func'", () => {
        expect((invocations[0] as Invocation).getCandidates().has(theFunction));
    });

    it("should contain an invocation with a sender 'invocationWithFunction.ts'", () => {
        expect((invocations[0] as Invocation).getSender()).toBe(fmxRep._getFamixFile("invocationWithFunction.ts"));
    });

    it("should contain an invocation with a receiver 'invocationWithFunction.ts'", () => {
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixFile("invocationWithFunction.ts"));
    });
});
