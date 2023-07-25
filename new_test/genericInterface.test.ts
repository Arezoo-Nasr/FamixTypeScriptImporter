import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { ParameterizableClass, ParameterizedType } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource(
    'interface MyDaoInterface<T> {\n\
}\n\
');

describe('Tests for generic interface', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain two generic class", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterizableClass").size).toBe(1);
    });

    it("should contain a generic interface MyDaoInterface", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass")).map(e => (e as ParameterizableClass).getName());
        expect(listOfNames).toContain("MyDaoInterface");
    });

    it("should contain a generic interface MyDaoInterface with a parameter type T", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const myDaoInterface = pList.find(p => p.getName() === "MyDaoInterface");
        expect(myDaoInterface).toBeTruthy();
        expect(myDaoInterface?.getParameterTypes().size).toBe(1);
        if (myDaoInterface) {
            expect((Array.from(myDaoInterface.getParameterTypes())[0] as ParameterizedType).getName()).toBe("T");
        }
    });

    const theInterface = fmxRep._getFamixClass("MyDaoInterface");
    it ("should not be an abstract class and it should be an interface", () => {
        expect(theInterface).toBeTruthy();
        if (theInterface) expect(theInterface.getIsAbstract()).toBe(false);
        if (theInterface) expect(theInterface.getIsInterface()).toBe(true);
    });

});
