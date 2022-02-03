import { TS2Famix } from '../src/ts2famix';
import 'jest-extended';

const filePaths = ["test_src/Decorators.ts"];
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

    it("should contain a class with the classDec decorator", async () => {
        const decorator = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.AnnotationType" && el.name == "classDec"))[0];
        expect(decorator.name).toBe("classDec");
    })
});