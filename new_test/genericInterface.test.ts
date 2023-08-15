import { Importer } from '../src/analyze';
import { ParameterizableInterface, ParameterType } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("genericInterface", 
    'interface MyInterface<T> {\n\
    myField;\n\
    myMethod();\n\
}\n\
');

describe('Tests for generic interface', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain one generic interface", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterizableInterface").size).toBe(1);
    });

    it("should contain a generic interface MyInterface", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableInterface")).map(e => (e as ParameterizableInterface).getName());
        expect(listOfNames).toContain("MyInterface");
    });

    it("should contain a generic interface MyInterface with a parameter type T", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableInterface") as Set<ParameterizableInterface>);
        expect(pList).toBeTruthy();
        const MyInterface = pList.find(p => p.getName() === "MyInterface");
        expect(MyInterface).toBeTruthy();
        expect(MyInterface?.getParameterTypes().size).toBe(1);
        if (MyInterface) {
            expect((Array.from(MyInterface.getParameterTypes())[0] as ParameterType).getName()).toBe("T");
        }
    });
});
