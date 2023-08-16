import { Importer } from '../src/analyze';
import { Alias } from '../src/lib/famix/src/model/famix';
import { Type } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("alias", 
    'type Point = {\n\
    x: number;\n\
    y: number;\n\
};\n\
');

describe('Tests for alias', () => {
    
    it("should contain one alias", () => {
        expect(fmxRep._getAllEntitiesWithType("Alias").size).toBe(1);
    });

    const theAlias = Array.from(fmxRep._getAllEntitiesWithType("Alias") as Set<Alias>)[0];
    it("should contain an alias Point", () => {
        expect(theAlias.getName()).toBe("Point");
    });

    const theType = Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>)[0];
    it("should contain a type Point", () => {
        expect(theType.getName()).toBe("Point");
    });

    it("should contain an alias on type Point", () => {
        expect(theType.getAliases().size).toBe(1);
        expect(Array.from(theType.getAliases())[0]).toBe(theAlias);
        expect(theAlias.getAliasedEntity()).toBe(theType);
    });
});
