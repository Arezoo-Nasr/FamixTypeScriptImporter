import { TS2Famix } from '../src/ts2famix';
import 'jest-extended';

const filePaths = ["resources/Inheritance.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();
let parsedModel: Array<any> = JSON.parse(jsonOutput);

const idToElementMap: Map<number, any> = new Map();
function initMapFromModel(model) {
    model.forEach(element => {
        idToElementMap.set(element.id, element);
    });
}

describe('ts2famix', () => {
    initMapFromModel(parsedModel);

    it("should contain a Fish class that's a subclass of Animal", async () => {
        const fishCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "Fish"))[0];
        console.info(`fishCls = ${JSON.stringify(fishCls)}`)
        expect(idToElementMap.get(fishCls.superclass.ref).name).toBe("Animal"); // peut-être pas le bon format de la définition de la superclasse
    })
});
