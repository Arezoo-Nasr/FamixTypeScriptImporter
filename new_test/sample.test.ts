//import { TS2Famix } from '../src/ts2famix-clean-version';
import * as parser from '../src/new-parsing-strategy/analyze'

const filePaths = ["new_test_src/sample.ts"];
//const importer = new TS2Famix();

//const fmxRep2 = importer.famixRepFromPath(filePaths);
const fmxRep2 = parser.famixRepFromPath(filePaths);

describe('Tests for sample', () => {
    
    it("should parse generics", () => {
        expect(fmxRep2).toBeTruthy()
    });
});
