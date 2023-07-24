
import { Importer } from '../src/new-parsing-strategy/analyze-class';

const importer = new Importer();
const fmxRep = importer.famixRepFromSource(
    'abstract class MyAbstractClass {\n\
}\n'
);

describe('Tests for abstract class', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    const theAbstractClass = fmxRep._getFamixClass("MyAbstractClass");

    it("should contain an abstract class MyAbstractClass", () => {
        expect(theAbstractClass).toBeTruthy();
        if (theAbstractClass) expect(theAbstractClass.getIsAbstract()).toBe(true);
    });

    it("should not be an interface", () => {
        expect(theAbstractClass).toBeTruthy();
        if (theAbstractClass) expect(theAbstractClass.getIsInterface()).toBe(false);
    });
});
