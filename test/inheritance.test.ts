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

    it("should contain a Fish class who has a superclass Animal", async () => {
        const fishCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "Fish"))[0];
        const superInheritance = idToElementMap.get(fishCls.superInheritances[0].ref);
        expect(idToElementMap.get(superInheritance.superclass.ref).name).toBe("Animal"); // nom de la superclasse
    })
    it("should contain an Animal class who has a subclass Fish", async () => {
        const animalCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "Animal"))[0];
        const subInheritance = idToElementMap.get(animalCls.subInheritances[0].ref);
        expect(idToElementMap.get(subInheritance.subclass.ref).name).toBe("Fish"); // nom de la superclasse
    })
});
