import { TS2Famix } from '../src/ts2famix';
import 'jest-extended';
import { forEachChild } from '@ts-morph/common/lib/typescript';

const filePaths = ["resources/Animal.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();
let parsedModel: Array<any>;

// to find entities in the model
const entityMap: Map<number, any> = new Map();
function initMapFromModel(model) {
    model.forEach(element => {
        entityMap.set(element.id, element);
    });
}

describe('ts2famix', () => {
    it("should generate valid json", async () => {
        parsedModel = JSON.parse(jsonOutput);
        expect(parsedModel).toBeTruthy();
        initMapFromModel(parsedModel);
    });

    it("should generate json with Animal Class", async () => {
        expect(jsonOutput).toMatch(/"FM3":"FamixTypeScript.Class","id":[1-9]\d*|0,"sourceAnchor":{"ref":[1-9]\d*|0},"name":"Animal"/);
    });

    it("model should contain some elements", async () => {
        expect(parsedModel.length).toBe(28);
    });

    it("should contain an Animal Class with three methods: move, move2 and constructor", async () => {
        const animalCls = parsedModel.filter(el => el.name == "Animal")[0];
        expect(animalCls.methods.length).toBe(3);
        let mNames: Set<string> = new Set();
        animalCls.methods.forEach(m => {
            mNames.add(entityMap.get(m.ref as number).name)
        });
        expect(mNames.has("move") && 
               mNames.has("move2") && 
               mNames.has("constructor")).toBeTrue();
    });

});
