import { TS2Famix } from '../src/ts2famix-clean-version';

const filePaths = ["new_test_src/abstractClass.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const theAbstractClass = fmxRep2.getFamixClass("MyAbstractClass");

describe('Tests for abstract class', () => {
    
    it("should parse generics", () => {
        expect(fmxRep2).toBeTruthy()
    });
    
    it("should contain one generic class", () => {
        expect(fmxRep2.getAllEntitiesWithType("ParameterizableClass").size).toBe(1);
    });

    it("should contain an abstract class MyAbstractClass", () => {
        expect(theAbstractClass).toBeTruthy();
        if (theAbstractClass) expect(theAbstractClass.getIsAbstract()).toBe(true);
    });

    it("should not be an interface", () => {
        expect(theAbstractClass).toBeTruthy();
        if (theAbstractClass) expect(theAbstractClass.getIsInterface()).toBe(false);
    });
});
