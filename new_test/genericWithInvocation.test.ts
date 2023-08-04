import { Importer } from '../src/new-parsing-strategy/analyze';
import { Method } from "../src/lib/famix/src/model/famix/method";
import { Variable } from "../src/lib/famix/src/model/famix/variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("genericWithInvocation", 
    'class AA {\n\
    public i<T> (j: T): void {}\n\
}\n\
\n\
const x = new AA();\n\
x.i<string>("ok");\n\
');

describe('Tests for generics', () => {

    const theMethod = fmxRep._getFamixMethod("i") as Method;

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain a variable x instance of AA", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("Variable") as Set<Variable>);
        expect(pList).toBeTruthy();
        const x = pList.find(p => p.getName() === "x");
        expect(x).toBeTruthy();
        expect(x?.getDeclaredType().getName()).toBe("AA");
    });
    
    it("should contain an invocation for i", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        const candidates = invocations.filter(i => {
            const invocation = i as Invocation;
            return invocation.getCandidates().has(theMethod);
        });
        expect(candidates).toHaveLength(1);
    });

    it("should contain an invocation for i with a receiver 'AA'", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getReceiver()).toBeTruthy();
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixClass("AA"));
    });

    it("should contain an invocation for i with a signature 'public i<T> (j: T): void'", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBe('public i<T> (j: T): void');
    });
});
