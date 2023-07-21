//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["new_test_src/abstractClass.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

//const fmxRep = importer.famixRepFromPath(filePaths);
//const fmxRep = parser.famixRepFromPath(filePaths);
const fmxRep = importer.famixRepFromPath(filePaths);

const theAbstractClass = fmxRep._getFamixClass("MyAbstractClass");

describe('Tests for abstract class', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
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
