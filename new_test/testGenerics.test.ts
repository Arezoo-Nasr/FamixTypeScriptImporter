//import { TS2Famix } from '../src/ts2famix-clean-version';
import * as parser from '../src/new-parsing-strategy/analyze';
import { Class } from "../src/lib/famix/src/model/famix/class";
import { Method } from "../src/lib/famix/src/model/famix/method";
import { Parameter } from "../src/lib/famix/src/model/famix/parameter";
import { LocalVariable } from "../src/lib/famix/src/model/famix/local_variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";

const filePaths = ["new_test_src/testGenerics.ts"];
//const importer = new TS2Famix();

//const fmxRep2 = importer.famixRepFromPath(filePaths);
const fmxRep2 = parser.famixRepFromPath(filePaths);
const theClass = fmxRep2.getFamixClass("AA");
const theMethod = fmxRep2.getFamixMethod("i") as Method;

describe('Tests for testGenerics', () => {

    it("should parse generics", () => {
        expect(fmxRep2).toBeTruthy();
    });
    
    it("should contain one class", () => {
        expect(fmxRep2.getAllEntitiesWithType("Class").size).toBe(1);
    });

    it("should contain a class AA", () => {
        const listOfNames = Array.from(fmxRep2.getAllEntitiesWithType("Class")).map(e => (e as Class).getName());
        expect(listOfNames).toContain("AA");
    });

    it("should not be an abstract class", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(false);
    });

    it("should not be an interface", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsInterface()).toBe(false);
    });

    it("should contain a generic method i for class AA with parameter type T", () => {
        const cList = Array.from(fmxRep2.getAllEntitiesWithType("Class") as Set<Class>);
        expect(cList).toBeTruthy();
        const AA = cList.find(c => c.getName() === "AA");
        const mList = Array.from(AA?.getMethods() as Set<Method>);
        const i = mList?.find(m => m.getName() === "i");
        expect(i).toBeTruthy();
        expect(i?.getDeclaredType().getName()).toBe("void");
        expect(i?.getParameters().size).toBe(1);
        const pList = Array.from(i?.getParameters() as Set<Parameter>);
        const j = pList?.find(p => p.getName() === "j");
        expect(j).toBeTruthy();
        expect(j?.getDeclaredType().getName()).toBe("T");
    });

    it("should contain a public method i", () => {
        const pList = Array.from(fmxRep2.getAllEntitiesWithType("Method") as Set<Method>);
        expect(pList).toBeTruthy();
        const i = pList.find(p => p.getName() === "i");
        expect(i).toBeTruthy();
        if (i) {
            expect(i.getIsAbstract()).toBe(false);
            expect(i.getIsConstructor()).toBe(false);
            expect(i.getIsClassSide()).toBe(false);
            expect(i.getIsPrivate()).toBe(false);
            expect(i.getIsProtected()).toBe(false);
            expect(i.getIsPublic()).toBe(true);
        }
    });

    it("should contain a variable x instance of AA", () => {
        const pList = Array.from(fmxRep2.getAllEntitiesWithType("LocalVariable") as Set<LocalVariable>);
        expect(pList).toBeTruthy();
        const x = pList.find(p => p.getName() === "x");
        expect(x).toBeTruthy();
        expect(x?.getDeclaredType().getName()).toBe("AA");
    });
    
    it("should contain an invocation for i", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep2.getAllEntitiesWithType("Invocation"));
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
        const invocations = Array.from(fmxRep2.getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getReceiver()).toBeTruthy();
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep2.getFamixClass("AA"));
    });

    it("should contain an invocation for i with a signature 'i <T> (j : T): void'", () => {
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep2.getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
        expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBe('i <T> (j : T): void');
    });
});
