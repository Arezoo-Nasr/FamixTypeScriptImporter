import { Importer } from '../src/analyze';
import { Method } from "../src/lib/famix/src/model/famix/method";
import { Variable } from "../src/lib/famix/src/model/famix/variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("invocationWithVariable", 
    'class AAA {\n\
    public method(): void {}\n\
}\n\
\n\
const x1 = new AAA();\n\
x1.method();\n\
');

describe('Tests for invocation with variable', () => {
    
    it("should contain a variable 'x1' instance of 'AAA'", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("Variable") as Set<Variable>);
        expect(pList).toBeTruthy();
        const x1 = pList.find(p => p.getName() === "x1");
        expect(x1).toBeTruthy();
        expect(x1?.getDeclaredType().getName()).toBe("AAA");
    });
    
    let theMethod = fmxRep._getFamixMethod("method") as Method;
    const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
    it("should contain one invocation", () => {
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
    });

    theMethod = fmxRep._getFamixMethod("method") as Method;
    it("should contain an invocation for 'method'", () => {
        expect((invocations[0] as Invocation).getCandidates().has(theMethod));
    });

    it("should contain an invocation with a receiver of type 'AAA'", () => {
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixClass("AAA"));
    });
});
