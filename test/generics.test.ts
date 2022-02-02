import { TS2Famix } from '../src/ts2famix';
import { Exception } from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/generics/**/*"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();
let parsedModel: Array<any>;

describe.skip('ts2famix', () => {
    // it("should generate valid json", async () => {
    //     parsedModel = JSON.parse(jsonOutput);
    //     expect(parsedModel).toBeTruthy();
    //     initMapFromModel(parsedModel);
    // });

    // it("should generate json with FM3 FamixTypeScript.Class for EntityClass", async () => {
    //     expect(jsonOutput)
    //         .toMatch(/"FM3":"FamixTypeScript.Class","id":[1-9]\d*|0,"sourceAnchor":{"ref":[1-9]\d*|0},"name":"EntityClass"/);
    // });

    it("should verify generics...", () => {
        throw new Error("test not implemented")
    });
});
