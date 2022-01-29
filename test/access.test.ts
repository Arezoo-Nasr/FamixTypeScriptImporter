import { TS2Famix } from "../src/ts2famix";
import 'jest-extended';

const filePaths = ["test_src/Access.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();

let parsedModel: Array<any>;
let accessCls;
let accessClsMethods: Array<any>;

describe('Access', () => {
    // it("should contain an Access class with two methods (public returnAccessName, private privateMethod) and two attributes: (public accessName, private privateAttribute)", () => {
    it("should contain an Access class with one method: returnAccessName and one attribute: accessName", () => {
            parsedModel = JSON.parse(jsonOutput);
        accessCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "AccessClassForTesting"))[0];
        expect(accessCls.methods.length).toBe(1);
        expect(accessCls.attributes.length).toBe(1);
        let methodNames: string[] = ['returnAccessName'/*,'privateMethod'*/];

        accessClsMethods = parsedModel.filter(e => accessCls.methods.some(m => m.ref == e.id));
        expect(accessClsMethods.length).toBeGreaterThan(0);
        let checkMethodName = accessClsMethods.every(m => methodNames.includes(m.name));
        expect(checkMethodName).toBeTrue();
    });

    // TODO add access to private method and check it with test
    it("should have one access for method", () => {
        let checkMethodHasAccess = accessClsMethods.every(
            m => m.accesses !== undefined
        );
        expect(checkMethodHasAccess).toBeTrue();

        accessClsMethods.forEach(method => {
            let accessClsAccess = parsedModel.filter(e => e.FM3 == "FamixTypeScript.Access"
                && method.accesses.some(m => m.ref == e.id));
            let checkHasRelatedToMethod = accessClsAccess.every(a => a.accessor !== undefined && a.accessor.ref == method.id);
            expect(checkHasRelatedToMethod).toBeTrue();
        });
    });

})
