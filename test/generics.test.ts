import { Importer } from '../src/new-parsing-strategy/analyze';
import { ParameterizableClass, ParameterType } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource(
    'interface MyDaoInterface<T> {}\n\
class MyDao<T> implements MyDaoInterface<T> {}\n\
');

describe('Generics', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });
    
    it("should contain two generic classes", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterizableClass").size).toBe(2);
    });
    
    it("should contain a generic class MyDao and generic interface MyDaoInterface", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass")).map(e => (e as ParameterizableClass).getName());
        expect(listOfNames).toContain("MyDao");
        expect(listOfNames).toContain("MyDaoInterface");
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
    
    it("should contain a generic interface MyDaoInterface with a parameter type T", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const myDaoInterface = pList.find(p => p.getName() === "MyDaoInterface");
        expect(myDaoInterface).toBeTruthy();
        expect(myDaoInterface?.getParameterTypes().size).toBe(1);
        if (myDaoInterface) {
            expect((Array.from(myDaoInterface.getParameterTypes())[0] as ParameterType).getName()).toBe("T");
        }
    });
    
    it("should contain a generic class MyDao that implements generic interface MyDaoInterface<T>", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const myDao = pList.find(p => p.getName() === "MyDao");
        expect(myDao).toBeTruthy();
        const myDaoInterface = pList.find(p => p.getName() === "MyDaoInterface");
        expect(myDaoInterface).toBeTruthy();
        if (myDao) {
            expect(myDao.getSuperInheritances().size).toBe(1);
            const theInheritance = (Array.from(myDao.getSuperInheritances())[0]);
            expect(theInheritance.getSuperclass()).toBeTruthy();
            expect(theInheritance.getSuperclass()).toBe(myDaoInterface);
        }
    });
});
