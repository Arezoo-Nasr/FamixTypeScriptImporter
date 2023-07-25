import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Attribute, Method } from "../src/lib/famix/src/model/famix";

const filePaths = ["test_src/Access.ts"];
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPaths(filePaths);
const jsonOutput = fmxRep2.getJSON();

const parsedModel = JSON.parse(jsonOutput);
let testAccessCls;
let accessClsMethods;
let accessClsAttributes;

describe('Accesses', () => {

    it("should have a class with two methods and two attributes", () => {
        const expectedAttributeNames: string[] = ['privateAttribute', 'publicAttribute'];
        const expectedMethodNames: string[] = ['privateMethod', 'returnAccessName'];
        testAccessCls = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "AccessClassForTesting"))[0];
        expect(testAccessCls.attributes.length).toBe(expectedAttributeNames.length);
        expect(testAccessCls.methods.length).toBe(expectedMethodNames.length);
        accessClsMethods = parsedModel.filter(e => testAccessCls.methods.some(m => m.ref === e.id));
        expect(accessClsMethods.length).toBeGreaterThan(0);
        const checkMethodName = accessClsMethods.every(m => expectedMethodNames.includes(m.name));
        expect(checkMethodName).toBe(true);
        accessClsAttributes = parsedModel.filter(e => testAccessCls.attributes.some(a => a.ref === e.id));
        expect(accessClsAttributes.length).toBeGreaterThan(0);
        const checkAttributeName = accessClsAttributes.every(a => expectedAttributeNames.includes(a.name));
        expect(checkAttributeName).toBe(true);
    });

    it("should have an access to privateAttribute in privateMethod", () => {
        const famixAccess = parsedModel.filter(el =>
            (el.accessor !== undefined && el.variable !== undefined && el.FM3 === "FamixTypeScript.Access"
                && ((fmxRep2.getFamixEntityById(el.accessor.ref) as Method).getName() === "privateMethod") 
                && ((fmxRep2.getFamixEntityById(el.variable.ref) as Attribute).getName() === "privateAttribute")
                ))[0];
        expect(famixAccess).toBeTruthy();
    });

    it("should have an access to publicAttribute in returnAccessName", () => {
        const famixAccess = parsedModel.filter(el =>
            (el.accessor !== undefined && el.variable !== undefined && el.FM3 === "FamixTypeScript.Access"
                && ((fmxRep2.getFamixEntityById(el.accessor.ref) as Method).getName() === "returnAccessName") 
                && ((fmxRep2.getFamixEntityById(el.variable.ref) as Attribute).getName() === "publicAttribute")
                ))[0];
        expect(famixAccess).toBeTruthy();
    });
});
