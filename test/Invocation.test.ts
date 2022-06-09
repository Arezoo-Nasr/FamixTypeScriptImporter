import { TS2Famix } from "../src/ts2famix";

const filePaths = ["test_src/Invocation.ts"];
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
        const invocationCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "Class1"))[0];
        const invocationClsMethods = parsedModel.filter(e => invocationCls.methods.some(m => m.ref == e.id));
        const methodNames: string[] = ['returnHi'];
        invocationClsMethods.forEach(m => expect(methodNames).toContain(m.name));
        const foundMethods = invocationClsMethods.filter(m => methodNames.includes(m.name));
        expect(foundMethods.length).toBe(1);
        const checkMethodHasInvocation = foundMethods.every(m => m.receivingInvocations !== undefined);
        expect(checkMethodHasInvocation).toBe(true);

        invocationClsMethods.forEach(method => {
            const invocationCls = parsedModel.filter(e => e.FM3 == "FamixTypeScript.Invocation"
                && method.receivingInvocations.some(m => m.ref == e.id));
            const checkHasRelatedToMethod = invocationCls.every(a => a.receiver !== undefined && a.receiver.ref == method.id);
            expect(checkHasRelatedToMethod).toBe(true);
        });
    });

    it("should have one invocation for method returnName in Class2",  () => {
        const invocationCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "Class2"))[0];
        const invocationClsMethods = parsedModel.filter(e => invocationCls.methods.some(m => m.ref == e.id));
        const methodNames: string[] = ['returnName'];
        invocationClsMethods.forEach(m => expect(methodNames).toContain(m.name));
        const foundMethods = invocationClsMethods.filter(m => methodNames.includes(m.name));
        expect(foundMethods.length).toBe(1);
        const checkMethodHasInvocation = foundMethods.every(m => m.receivingInvocations !== undefined);
        expect(checkMethodHasInvocation).toBe(true);

        invocationClsMethods.forEach(method => {
            const invocationCls = parsedModel.filter(e => e.FM3 == "FamixTypeScript.Invocation"
                && method.receivingInvocations.some(m => m.ref == e.id));
            const checkHasRelatedToMethod = invocationCls.every(a => a.receiver !== undefined && a.receiver.ref == method.id);
            expect(checkHasRelatedToMethod).toBe(true);
        });
    });

})
