import { Importer } from '../src/new-parsing-strategy/analyze';
import { ParameterizableClass, ParameterType } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource(
    'class MyDao<T> {\n\
}\n\
');

describe('Tests for generic class', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain one generic class", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterizableClass").size).toBe(1);
    });

    it("should contain a generic class MyDao", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass")).map(e => (e as ParameterizableClass).getName());
        expect(listOfNames).toContain("MyDao");
    });

    it("should contain a generic class MyDao with a parameter type T", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const myDao = pList.find(p => p.getName() === "MyDao");
        expect(myDao).toBeTruthy();
        expect(myDao?.getParameterTypes().size).toBe(1);
        if (myDao) {
            expect((Array.from(myDao.getParameterTypes())[0] as ParameterType).getName()).toBe("T");
        }
    });

    const theClass = fmxRep._getFamixClass("MyDao");
    it ("should not be an abstract class nor an interface", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(false);
        if (theClass) expect(theClass.getIsInterface()).toBe(false);
    });
});
