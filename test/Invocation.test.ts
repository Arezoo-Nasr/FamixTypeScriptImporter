import { Invocation, Method } from "../src/lib/famix/src/model/famix";
import { TS2Famix } from "../src/ts2famix";

const filePaths = ["test_src/invocations/*.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);

describe('Invocation', () => {

    it("should contain method returnHi in Class1", () => {
        const clsName = "Class1";
        const mName = "returnHi";
        const theClass = fmxRep2.getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn).toBe(clsName + '.' + mName);
            const theMethod = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    })
    it("should contain method returnName in Class2", () => {
        const clsName = "Class2";
        const mName = "returnName";
        const theClass = fmxRep2.getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn).toBe(clsName + '.' + mName);
            const theMethod = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    })
    it("should contain method getString in Class3", () => {
        const clsName = "Class3";
        const mName = "getString";
        const theClass = fmxRep2.getFamixClass(clsName);
        expect(theClass).toBeTruthy();
        if (theClass) {
            const methodFqn = Array.from(theClass.getMethods())[0].getFullyQualifiedName();
            expect(methodFqn).toBe(clsName + '.' + mName);
            const theMethod = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });
    it("should contain an invocation for returnHi", () => {
        const theMethod = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName("Class1.returnHi") as Method;
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep2.getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBeTruthy();
        const candidates = invocations.filter(i => {
            const invocation = i as Invocation;
            console.log(`candidates for ${theMethod} invocation ${invocation}: ${invocation.getCandidates()}`)
            return invocation.getCandidates().has(theMethod)
        });
        expect(candidates).toHaveLength(1);
    });

    it("should contain an invocation for returnHi with a receiver of 'Class1'", () => {
        const theMethod = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName("Class1.returnHi") as Method;
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep2.getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBeTruthy();
        expect((invocations[0] as Invocation).getReceiver()).toBeTruthy();
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep2.getFamixClass("Class1"));
    });

    it("should contain an invocation for returnHi with a signature 'public returnHi(): string'", () => {
        const theMethod = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName("Class1.returnHi") as Method;
        expect(theMethod).toBeTruthy();
        const invocations = Array.from(fmxRep2.getAllEntitiesWithType("Invocation"));
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
        expect((invocations[0] as Invocation).getSignature()).toBe('public returnHi(): string');
    })

    // it("should contain an invocation for a function 'a' with a signature 'function a(b: number)'", () => {
    //     const theFunction = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName("a") as FamixFunction;
    //     expect(theFunction).toBeTruthy();
    //     const invocations = Array.from(fmxRep2.getAllEntitiesWithType("Invocation"));
    //     expect(invocations).toBeTruthy();
    //     expect(invocations.length).toBeTruthy();
    //     expect((invocations[0] as Invocation).getSignature()).toBeTruthy();
    //     expect((invocations[0] as Invocation).getSignature()).toBe('public returnHi(): string');
    // })

})
