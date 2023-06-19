import { TS2Famix } from '../src/ts2famix-clean-version';
import { Method, Class} from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/Entity.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();
let parsedModel = JSON.parse(jsonOutput);

describe('ts2famix json', () => {

    it("should generate valid json", () => { // smoke test parse (change to non-empty)
        expect(parsedModel).toBeTruthy();
    });

    it("should generate json with FM3 FamixTypeScript.Class for EntityClass", () => {
        expect(jsonOutput).toMatch(/"FM3":"FamixTypeScript.Class","id":[1-9]\d*|0,"sourceAnchor":{"ref":[1-9]\d*|0},"name":"EntityClass"/);
    });

    it("should contain an EntityClass with three methods.", () => {
        const theClass = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "EntityClass"))[0];
        expect(theClass.methods.length).toBe(3);

    })

    it("should have three methods: move, move2 and constructor", () => { 
        const theClass = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "EntityClass"))[0];
        let mNames: Set<string> = new Set();
        theClass.methods.forEach(m => {
            const entityCls = fmxRep2.getFamixElementById(m.ref as number) as Method;
            mNames.add(entityCls.getName())
        });
        expect(mNames.has("move") &&
            mNames.has("move2") &&
            mNames.has("constructor")).toBe(true);
    });

    it("should have method move", () => { 
        const theMethod = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Method" && el.name == "move"))[0];
        expect(theMethod).toBeTruthy();
    });

    // it("should be a child of the right class", () => { 
    //     const theClass: Class = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "EntityClass"))[0];
    //     const theMethod: Method = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Method" && el.name == "move"))[0];
    //     expect(theMethod.getParentType()).toEqual(theClass);
    // });
});
