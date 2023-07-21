//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Class } from "../src/lib/famix/src/model/famix/class";
import { Method } from "../src/lib/famix/src/model/famix/method";
import { LocalVariable } from "../src/lib/famix/src/model/famix/local_variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";

const filePaths = ["new_test_src/invocationWithVariable.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

//const fmxRep = importer.famixRepFromPath(filePaths);
//const fmxRep = parser.famixRepFromPath(filePaths);
const fmxRep = importer.famixRepFromPath(filePaths);

const theClass = fmxRep._getFamixClass("AAA");
const theMethod = fmxRep._getFamixMethod("method") as Method;

describe('Tests for invocationWithVariable', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    it("should contain a class 'AAA'", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("Class")).map(e => (e as Class).getName());
        expect(listOfNames).toContain("AAA");
    });

    it("should not be an abstract class", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(false);
    });

    it("should not be an interface", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsInterface()).toBe(false);
    });

    it("should contain a method 'method' for class 'AAA' with no parameter", () => {
        const cList = Array.from(fmxRep._getAllEntitiesWithType("Class") as Set<Class>);
        expect(cList).toBeTruthy();
        const AAA = cList.find(c => c.getName() === "AAA");
        const mList = Array.from(AAA?.getMethods() as Set<Method>);
        const method = mList?.find(m => m.getName() === "method");
        expect(method).toBeTruthy();
        expect(method?.getDeclaredType().getName()).toBe("void");
        expect(method?.getParameters().size).toBe(0);
    });

    it("should contain a public method 'method", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("Method") as Set<Method>);
        expect(pList).toBeTruthy();
        const method = pList.find(p => p.getName() === "method");
        expect(method).toBeTruthy();
        if (method) {
            expect(method.getIsAbstract()).toBe(false);
            expect(method.getIsConstructor()).toBe(false);
            expect(method.getIsClassSide()).toBe(false);
            expect(method.getIsPrivate()).toBe(false);
            expect(method.getIsProtected()).toBe(false);
            expect(method.getIsPublic()).toBe(true);
        }
    });

    it("should contain a variable 'x1' instance of 'AAA'", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("GlobalVariable") as Set<LocalVariable>);
        expect(pList).toBeTruthy();
        const x1 = pList.find(p => p.getName() === "x1");
        expect(x1).toBeTruthy();
        expect(x1?.getDeclaredType().getName()).toBe("AAA");
    });
    
    it("should contain an invocation for 'method'", () => {
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

    it("should contain an invocation for 'method' with a receiver 'AAA'", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getReceiver()).toBeTruthy();
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixClass("AAA"));
    });

    it("should contain an invocation for 'method' with a signature 'public method(): void'", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBe('public method(): void');
    });
});
