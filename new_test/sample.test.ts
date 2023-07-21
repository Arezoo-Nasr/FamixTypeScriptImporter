//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["new_test_src/sample.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

//const fmxRep = importer.famixRepFromPath(filePaths);
//const fmxRep = parser.famixRepFromPath(filePaths);
const fmxRep = importer.famixRepFromPath(filePaths);

describe('Tests for sample', () => {
    
    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });
});
