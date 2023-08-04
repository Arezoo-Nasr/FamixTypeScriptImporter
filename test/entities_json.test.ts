import { Importer } from '../src/new-parsing-strategy/analyze';
import { Method } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("entities_json", 
    'class EntityClass {\n\
    constructor() {}\n\
    public move() {}\n\
    private move2() {}\n\
}\n\
');

describe('Entities json', () => {

    const jsonOutput = fmxRep.getJSON();
    const parsedModel = JSON.parse(jsonOutput);

    it("should generate valid json", () => { // smoke test parse (change to non-empty)
        expect(parsedModel).toBeTruthy();
    });

    it("should generate json with FM3 FamixTypeScript.Class for EntityClass", () => {
        expect(jsonOutput).toMatch(/"FM3":"FamixTypeScript.Class","id":[1-9]\d*|0,"sourceAnchor":{"ref":[1-9]\d*|0},"name":"EntityClass"/);
    });

    it("should contain an EntityClass with three methods", () => {
        const theClass = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "EntityClass"))[0];
        expect(theClass.methods.length).toBe(3);
    });

    it("should have three methods: move, move2 and constructor", () => { 
        const theClass = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "EntityClass"))[0];
        const mNames: Set<string> = new Set();
        theClass.methods.forEach(m => {
            const entityCls = fmxRep.getFamixEntityById(m.ref as number) as Method;
            mNames.add(entityCls.getName());
        });
        expect(mNames.has("move") &&
            mNames.has("move2") &&
            mNames.has("constructor")).toBe(true);
    });

    it("should have method move", () => { 
        const theMethod = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Method" && el.name === "move"))[0];
        expect(theMethod).toBeTruthy();
    });
});
