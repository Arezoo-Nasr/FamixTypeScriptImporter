import { Importer } from '../src/analyze';

const filePaths = ["test_src/sample.ts"];
const importer = new Importer();

const fmxRep = importer.famixRepFromPaths(filePaths);

describe('Tests for sample', () => {
    
    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });
});
