import { Invocation, Method } from "../src/lib/famix/src/model/famix";
import { TS2Famix } from "../src/ts2famix";

const filePaths = ["test_src/Invocation.ts"];
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
            const theMethod = fmxRep2.getFamixElementByFullyQualifiedName(
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
            const theMethod = fmxRep2.getFamixElementByFullyQualifiedName(
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
            const theMethod = fmxRep2.getFamixElementByFullyQualifiedName(
                methodFqn);
            expect(theMethod).toBeTruthy();    
        }
    });
    it("should contain an invocation for returnHi", () => {
        const theMethod = fmxRep2.getFamixElementByFullyQualifiedName("Class1.returnHi") as Method;
        expect(theMethod).toBeTruthy();
        const invocations = fmxRep2.getAllEntitiesWithType("Invocation");
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBeTruthy();
        const candidates = invocations.filter(i => {
            const invocation = i as Invocation;
            console.log(`candidates for ${theMethod} invocation ${invocation}: ${invocation.getCandidates()}`)
            return invocation.getCandidates().has(theMethod)
        });
        expect(candidates).toHaveLength(1);
    })

})
