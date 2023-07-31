import { Importer } from '../src/new-parsing-strategy/analyze';
import { ParameterizableClass, ParameterType } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("genericInterface", 
    'interface MyInterface<T> {}\n\
');

describe('Tests for generic interface', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain one generic class", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterizableClass").size).toBe(1);
    });

    it("should contain a generic interface MyInterface", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass")).map(e => (e as ParameterizableClass).getName());
        expect(listOfNames).toContain("MyInterface");
    });

    it("should contain a generic interface MyInterface with a parameter type T", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const MyInterface = pList.find(p => p.getName() === "MyInterface");
        expect(MyInterface).toBeTruthy();
        expect(MyInterface?.getParameterTypes().size).toBe(1);
        if (MyInterface) {
            expect((Array.from(MyInterface.getParameterTypes())[0] as ParameterType).getName()).toBe("T");
        }
    });

    const theInterface = fmxRep._getFamixClass("MyInterface");
    it ("should not be an abstract class and it should be an interface", () => {
        expect(theInterface).toBeTruthy();
        if (theInterface) expect(theInterface.getIsAbstract()).toBe(false);
        if (theInterface) expect(theInterface.getIsInterface()).toBe(true);
    });

});
