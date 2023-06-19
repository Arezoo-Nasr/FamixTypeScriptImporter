import { TS2Famix } from "../src/ts2famix-clean-version";

const filePaths = ["test_src/invocations/*.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();

let parsedModel: Array<any>;

describe('Invocation', () => {

    it("should contain a class Class3 with one method: getString", () => {
        parsedModel = JSON.parse(jsonOutput);
        const invocationCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "Class3"))[0];
        expect(invocationCls.methods.length).toBe(1);
        let methodNames: string[] = ['getString'];

        const invocationClsMethods = parsedModel.filter(e => invocationCls.methods.some(m => m.ref == e.id));
        expect(invocationClsMethods.length).toBeGreaterThan(0);
        let checkMethodName = invocationClsMethods.every(m => methodNames.includes(m.name));
        expect(checkMethodName).toBe(true);
    });

    it("should have one invocation for method returnHi in Class1",  () => {
        verifyInvocation("Class1", "returnHi");
    });

    it("should have one invocation for method returnName in Class2",  () => {
        verifyInvocation("Class2", "returnName");
    });

})

function verifyInvocation(theClass: string, theMethod: string) {
    
    const invocationCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == theClass))[0];
    const invocationClsMethods = parsedModel.filter(e => invocationCls.methods.some(m => m.ref == e.id));
    const methodNames: string[] = [theMethod];
    invocationClsMethods.forEach(m => expect(methodNames).toContain(m.name));
    const foundMethods = invocationClsMethods.filter(m => methodNames.includes(m.name));
    expect(foundMethods.length).toBe(1);
    const checkMethodHasInvocation = foundMethods.every(m => m.incomingInvocations !== undefined);
    expect(checkMethodHasInvocation).toBe(true);

    invocationClsMethods.forEach(method => {
        const invocationCls = parsedModel.filter(e => e.FM3 == "FamixTypeScript.Invocation"
            && method.incomingInvocations.some(m => m.ref == e.id));
        const checkHasRelatedToMethod = invocationCls.every(a => a.candidates.length && a.candidates[0].ref == method.id);
        expect(checkHasRelatedToMethod).toBe(true);
    });
}
