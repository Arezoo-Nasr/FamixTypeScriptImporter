import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Class } from "../src/lib/famix/src/model/famix/class";
import { Method } from "../src/lib/famix/src/model/famix/method";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";

const filePaths = ["new_test_src/invocation.ts"];
const importer = new Importer();

const fmxRep = importer.famixRepFromPaths(filePaths);

describe('Tests for invocation', () => {

    const theMethod = fmxRep._getFamixMethod("x") as Method;

    it("should contain two class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(2);
    });

    it("should contain a class A and a class B", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("Class")).map(e => (e as Class).getName());
        expect(listOfNames).toContain("A");
        expect(listOfNames).toContain("B");
    });

    it("should contain a method x for class A", () => {
        const cList = Array.from(fmxRep._getAllEntitiesWithType("Class") as Set<Class>);
        expect(cList).toBeTruthy();
        const A = cList.find(c => c.getName() === "A");
        const mList = Array.from(A?.getMethods() as Set<Method>);
        const x = mList?.find(m => m.getName() === "x");
        expect(x).toBeTruthy();
        expect(x?.getDeclaredType().getName()).toBe("void");
        expect(x?.getParameters().size).toBe(0);
    });

    it("should contain a method y for class B", () => {
        const cList = Array.from(fmxRep._getAllEntitiesWithType("Class") as Set<Class>);
        expect(cList).toBeTruthy();
        const B = cList.find(c => c.getName() === "B");
        const mList = Array.from(B?.getMethods() as Set<Method>);
        const y = mList?.find(m => m.getName() === "y");
        expect(y).toBeTruthy();
        expect(y?.getDeclaredType().getName()).toBe("void");
        expect(y?.getParameters().size).toBe(0);
    });

    it("should contain an invocation for x", () => {
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

    it("should contain an invocation for x with a receiver 'A'", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getReceiver()).toBeTruthy();
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixClass("A"));
    });

    it("should contain an invocation for x with a signature 'public x(): void'", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBe('public x(): void');
    });
});
