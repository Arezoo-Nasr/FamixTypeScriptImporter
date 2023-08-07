import { Importer } from '../src/analyze';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("abstractClass", 
    'abstract class MyAbstractClass {}\n\
');

describe('Tests for abstract class', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    const theAbstractClass = fmxRep._getFamixClass("MyAbstractClass");
    it("should contain an abstract class MyAbstractClass", () => {
        expect(theAbstractClass).toBeTruthy();
        if (theAbstractClass) expect(theAbstractClass.getIsAbstract()).toBe(true);
    });
});
