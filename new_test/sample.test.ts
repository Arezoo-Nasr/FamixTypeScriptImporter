//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["new_test_src/sample.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

//const fmxRep = importer.famixRepFromPaths(filePaths);
//const fmxRep = parser.famixRepFromPaths(filePaths);
const fmxRep = importer.famixRepFromPaths(filePaths);

describe('Tests for sample', () => {
    
    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });
});
