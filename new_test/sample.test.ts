import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["new_test_src/sample.ts"];
const importer = new Importer();

const fmxRep = importer.famixRepFromPaths(filePaths);

describe('Tests for sample', () => {
    
    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });
});
