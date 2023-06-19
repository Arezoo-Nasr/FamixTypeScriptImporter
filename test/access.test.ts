import { TS2Famix } from "../src/ts2famix-clean-version";
import { Attribute, Method } from "../src/lib/famix/src/model/famix";
import { FamixTypeScriptElementStorage } from "../src/lib/famix/src/famix_JSON_exporter";

const filePaths = ["test_src/Access.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();

let parsedModel: Array<FamixTypeScriptElementStorage> = JSON.parse(jsonOutput);
let testAccessCls;
let accessClsMethods: Array<any>;
let accessClsAttributes: Array<any>;

describe('Access', () => {

    it("should have a class with two methods and two attributes", () => {
        let expectedAttributeNames: string[] = ['privateAttribute', 'publicAttribute'];
        let expectedMethodNames: string[] = ['privateMethod', 'returnAccessName'];
        testAccessCls = parsedModel.filter(el =>
            (el.FM3 == "FamixTypeScript.Class" && el.name == "AccessClassForTesting"))[0];
        expect(testAccessCls.attributes.length).toBe(expectedAttributeNames.length);
        expect(testAccessCls.methods.length).toBe(expectedMethodNames.length);

        accessClsMethods = parsedModel.filter(e => testAccessCls.methods.some(m => m.ref == e.id));
        expect(accessClsMethods.length).toBeGreaterThan(0);
        let checkMethodName = accessClsMethods.every(m => expectedMethodNames.includes(m.name));
        expect(checkMethodName).toBe(true);
        accessClsAttributes = parsedModel.filter(e => testAccessCls.attributes.some(a => a.ref == e.id));
        expect(accessClsAttributes.length).toBeGreaterThan(0);
        let checkAttributeName = accessClsAttributes.every(a => expectedAttributeNames.includes(a.name));
        expect(checkAttributeName).toBe(true);
    });

    it("should have an access to privateAttribute in privateMethod", () => {
        const famixAccess = parsedModel.filter(el =>
            (el.FM3 == "FamixTypeScript.Access"
                && el.accessor != undefined
                && ((fmxRep2.getFamixElementById(el.accessor.ref) as Method).getName() == "privateMethod")
                && el.variable != undefined 
                && ((fmxRep2.getFamixElementById(el.variable.ref) as Attribute).getName() == "privateAttribute")
                ))[0];
        expect(famixAccess).toBeTruthy();
    });

    it("should have an access to publicAttribute in returnAccessName", () => {
        const famixAccess = parsedModel.filter(el =>
            (el.FM3 == "FamixTypeScript.Access"
                && el.accessor != undefined
                && ((fmxRep2.getFamixElementById(el.accessor.ref) as Method).getName() == "returnAccessName") 
                && el.variable != undefined
                && ((fmxRep2.getFamixElementById(el.variable.ref) as Attribute).getName() == "publicAttribute")
                ))[0];
        expect(famixAccess).toBeTruthy();
    });
})
