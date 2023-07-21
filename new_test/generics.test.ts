//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { ParameterizableClass, ParameterizedType } from '../src/lib/famix/src/model/famix';

const filePaths = ["new_test_src/generics/*.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

//const fmxRep = importer.famixRepFromPath(filePaths);
//const fmxRep = parser.famixRepFromPath(filePaths);
const fmxRep = importer.famixRepFromPath(filePaths);

const theClass = fmxRep._getFamixClass("MyDao");
const theInterface = fmxRep._getFamixClass("MyDaoInterface");

describe('Tests for generics', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain two generic class", () => {
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
            expect((Array.from(myDao.getParameterTypes())[0] as ParameterizedType).getName()).toBe("T");
        }
    });

    it ("should not be an abstract class nor an interface", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(false);
        if (theClass) expect(theClass.getIsInterface()).toBe(false);
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

    it ("should not be an abstract class and it should be an interface", () => {
        expect(theInterface).toBeTruthy();
        if (theInterface) expect(theInterface.getIsAbstract()).toBe(false);
        if (theInterface) expect(theInterface.getIsInterface()).toBe(true);
    });

    // it("should contain a generic class MyDao that implements generic interface MyDaoInterface<T>", () => {
    //     const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
    //     expect(pList).toBeTruthy();
    //     const myDao = pList.find(p => p.getName() === "MyDao");
    //     expect(myDao).toBeTruthy();
    //     const myDaoInterface = pList.find(p => p.getName() === "MyDaoInterface");
    //     expect(myDaoInterface).toBeTruthy();
    //     if (myDao) {
    //         expect(myDao.getSuperInheritances().size).toBe(1);
    //         const theInheritance = (Array.from(myDao.getSuperInheritances())[0]);
    //         expect(theInheritance.getSuperclass()).toBeTruthy();
    //         expect(theInheritance.getSuperclass()).toBe(myDaoInterface);
    //     }
    // });
});
