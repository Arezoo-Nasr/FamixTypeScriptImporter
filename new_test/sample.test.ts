import { Importer } from '../src/new-parsing-strategy/analyze';

const filePaths = ["new_parsing_strategy/sample.ts"];
const importer = new Importer();

const fmxRep = importer.famixRepFromPaths(filePaths);

describe('Tests for sample', () => {
    
    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });
});
