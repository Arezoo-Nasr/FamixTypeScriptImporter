//import { TS2Famix } from '../src/ts2famix-clean-version';
import * as parser from '../src/new-parsing-strategy/analyze'
import { ParameterizableClass, ParameterizedType } from '../src/lib/famix/src/model/famix';

const filePaths = ["new_test_src/generics.ts"];
//const importer = new TS2Famix();

//const fmxRep2 = importer.famixRepFromPath(filePaths);
const fmxRep2 = parser.famixRepFromPath(filePaths);
const theClass = fmxRep2.getFamixClass("MyDao");

describe('Tests for generics', () => {

    it("should parse generics", () => {
        expect(fmxRep2).toBeTruthy()
    });

    it("should contain one generic class", () => {
        expect(fmxRep2.getAllEntitiesWithType("ParameterizableClass").size).toBe(1);
    });

    it("should contain a generic class MyDao", () => {
        const listOfNames = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass")).map(e => (e as ParameterizableClass).getName());
        expect(listOfNames).toContain("MyDao");
    });

    it("should contain a generic class MyDao with a parameter type T", () => {
        const pList = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const myDao = pList.find(p => p.getName() == "MyDao");
        expect(myDao).toBeTruthy();
        expect(myDao?.getParameterTypes().size).toBe(1);
        if (myDao) {
            expect((Array.from(myDao.getParameterTypes())[0] as ParameterizedType).getName()).toBe("T");
        }
    });

    it ("should not be an abstract class nor an interface", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(false);
        if (theClass) expect(theClass.getIsInterface()).toBe(false);
    });
});
