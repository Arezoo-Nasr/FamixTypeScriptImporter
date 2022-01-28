import { TS2Famix } from "../src/ts2famix";
import 'jest-extended';

const filePaths = ["test_src/Invocation.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();

let parsedModel: Array<any>;
let invocationCls;
let invocationClsMethods: Array<any>;

describe('Invocation', () => {
    it("should contain a class Class3 with one method: getString", async () => {
        parsedModel = JSON.parse(jsonOutput);
        invocationCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "Class3"))[0];
        expect(invocationCls.methods.length).toBe(1);
        let methodNames: string[] = ['getString'];

        invocationClsMethods = parsedModel.filter(e => invocationCls.methods.some(m => m.ref == e.id));
        expect(invocationClsMethods.length).toBeGreaterThan(0);
        let checkMethodName = invocationClsMethods.every(m => methodNames.includes(m.name));
        expect(checkMethodName).toBeTrue();
    });

    it("should have one invocation for method", async () => {
        let checkMethodHasInvocation = invocationClsMethods.every(m => m.receivingInvocations !== undefined);
        expect(checkMethodHasInvocation).toBeTrue();

        invocationClsMethods.forEach(method => {
            let invocationCls = parsedModel.filter(e => e.FM3 == "FamixTypeScript.Invocation"
                && method.receivingInvocations.some(m => m.ref == e.id));
            let checkHasRelatedToMethod = invocationCls.every(a => a.receiver !== undefined && a.receiver.ref == method.id);
            expect(checkHasRelatedToMethod).toBeTrue();
        });
    });

})
