import { TS2Famix } from '../src/ts2famix';
import 'jest-extended';

describe('ts2famix', () => {
    it("should generate json", async () => {
        const filePaths = ["resources/**.ts"];
        const importer = new TS2Famix();

        const fmxRep2 = importer.famixRepFromPath(filePaths);
        const jsonOutput = fmxRep2.getJSON();
        // very basic test for now
        expect(jsonOutput).toMatch(/FamixTypeScript.Class/);
    });
});