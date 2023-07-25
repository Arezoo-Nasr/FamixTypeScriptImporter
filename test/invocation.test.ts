import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Invocation, Method } from "../src/lib/famix/src/model/famix";

const filePaths = ["test_src/invocations/*.ts"];
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPaths(filePaths);

describe('Invocation', () => {

    it("should contain method returnHi in Class1", () => {
        const clsName = "Class1";
        const mName = "returnHi";
        const theClass = fmxRep2._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn.substring(methodFqn.length-clsName.length-1-mName.length)).toBe(clsName + '.' + mName);
            const theMethod = fmxRep2.getFamixEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });

    it("should contain method returnName in Class2", () => {
        const clsName = "Class2";
        const mName = "returnName";
        const theClass = fmxRep2._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn.substring(methodFqn.length-clsName.length-1-mName.length)).toBe(clsName + '.' + mName);
            const theMethod = fmxRep2.getFamixEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });

    it("should contain method getString in Class3", () => {
        const clsName = "Class3";
        const mName = "getString";
        const theClass = fmxRep2._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn.substring(methodFqn.length-clsName.length-1-mName.length)).toBe(clsName + '.' + mName);
            const theMethod = fmxRep2.getFamixEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });

    it("should contain an invocation for returnHi", () => {
        const clsName = "Class1";
        const theClass = fmxRep2._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            const theMethod = fmxRep2.getFamixEntityElementByFullyQualifiedName(methodFqn) as Method;
            expect(theMethod).toBeTruthy();
            const invocations = Array.from(fmxRep2._getAllEntitiesWithType("Invocation"));
            expect(invocations).toBeTruthy();
            expect(invocations.length).toBeTruthy();
            const candidates = invocations.filter(i => {
                const invocation = i as Invocation;
                console.log(`candidates for ${theMethod} invocation ${invocation}: ${invocation.getCandidates()}`);
                return invocation.getCandidates().has(theMethod);
            });
            expect(candidates).toHaveLength(1);
        }
    });

    it("should contain an invocation for returnHi with a receiver of 'Class1'", () => {
        const clsName = "Class1";
        const theClass = fmxRep2._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            const theMethod = fmxRep2.getFamixEntityElementByFullyQualifiedName(methodFqn) as Method;
            expect(theMethod).toBeTruthy();
            const invocations = Array.from(fmxRep2._getAllEntitiesWithType("Invocation"));
            expect(invocations).toBeTruthy();
            expect(invocations.length).toBeTruthy();
            expect((invocations[0] as Invocation).getReceiver()).toBeTruthy();
            expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep2._getFamixClass("Class1"));
        }
    });

    it("should contain an invocation for returnHi with a signature 'public returnHi(): string'", () => {
        const clsName = "Class1";
        const theClass = fmxRep2._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            const theMethod = fmxRep2.getFamixEntityElementByFullyQualifiedName(methodFqn) as Method;
            expect(theMethod).toBeTruthy();
            const invocations = Array.from(fmxRep2._getAllEntitiesWithType("Invocation"));
            expect(invocations).toBeTruthy();
            expect(invocations.length).toBeTruthy();
            expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
            expect((invocations[0] as Invocation).getSignature()).toBe('public returnHi(): string');
        }
    });

    it("should contain an invocation for a function 'a' with a signature 'function a(b: number)'", () => {
        const theFunction = fmxRep2._getFamixFunction("a");
        expect(theFunction).toBeTruthy();
        const invocations = Array.from(fmxRep2._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBe('public returnHi(): string');
    });
});
