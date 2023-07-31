import { Importer } from '../src/new-parsing-strategy/analyze';
import { Invocation, Method } from "../src/lib/famix/src/model/famix";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("invocations", 
    'class Class1 {\n\
    public returnHi(): string {\n\
        return "Hi";\n\
    }\n\
}\n\
\n\
class Class2 {\n\
    public returnName() {}\n\
}\n\
\n\
class Class3 {\n\
    public getString() {\n\
        var class1Obj = new Class1();\n\
        var class2Obj = new Class2();\n\
        var returnValue1 = class1Obj.returnHi();\n\
        var returnValue2 = class2Obj.returnName();\n\
        var x = a();\n\
    }\n\
}\n\
\n\
function a() {}\n\
');

describe('Invocations', () => {

    it("should contain method returnHi in Class1", () => {
        const clsName = "Class1";
        const mName = "returnHi";
        const theClass = fmxRep._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn.substring(methodFqn.length-clsName.length-1-mName.length)).toBe(clsName + '.' + mName);
            const theMethod = fmxRep.getFamixEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });

    it("should contain method returnName in Class2", () => {
        const clsName = "Class2";
        const mName = "returnName";
        const theClass = fmxRep._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn.substring(methodFqn.length-clsName.length-1-mName.length)).toBe(clsName + '.' + mName);
            const theMethod = fmxRep.getFamixEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });

    it("should contain method getString in Class3", () => {
        const clsName = "Class3";
        const mName = "getString";
        const theClass = fmxRep._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn.substring(methodFqn.length-clsName.length-1-mName.length)).toBe(clsName + '.' + mName);
            const theMethod = fmxRep.getFamixEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });

    it("should contain an invocation for returnHi", () => {
        const clsName = "Class1";
        const theClass = fmxRep._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            const theMethod = fmxRep.getFamixEntityElementByFullyQualifiedName(methodFqn) as Method;
            expect(theMethod).toBeTruthy();
            const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
            expect(invocations).toBeTruthy();
            expect(invocations.length).toBeTruthy();
            const candidates = invocations.filter(i => {
                const invocation = i as Invocation;
                return invocation.getCandidates().has(theMethod);
            });
            expect(candidates).toHaveLength(1);
        }
    });

    it("should contain an invocation for returnHi with a receiver of 'Class1'", () => {
        const clsName = "Class1";
        const theClass = fmxRep._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            const theMethod = fmxRep.getFamixEntityElementByFullyQualifiedName(methodFqn) as Method;
            expect(theMethod).toBeTruthy();
            const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
            expect(invocations).toBeTruthy();
            expect(invocations.length).toBeTruthy();
            expect((invocations[0] as Invocation).getReceiver()).toBeTruthy();
            expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixClass("Class1"));
        }
    });

    it("should contain an invocation for returnHi with a signature 'public returnHi(): string'", () => {
        const clsName = "Class1";
        const theClass = fmxRep._getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            const theMethod = fmxRep.getFamixEntityElementByFullyQualifiedName(methodFqn) as Method;
            expect(theMethod).toBeTruthy();
            const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
            expect(invocations).toBeTruthy();
            expect(invocations.length).toBeTruthy();
            expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
            expect((invocations[0] as Invocation).getSignature()).toBe('public returnHi(): string');
        }
    });

    it("should contain an invocation for a function 'a'", () => {
        const theFunction = fmxRep._getFamixFunction("a");
        expect(theFunction).toBeTruthy();
        const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBe('public returnHi(): string');
    });
});
