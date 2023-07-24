//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { ParameterizableClass, ParameterizedType } from '../src/lib/famix/src/model/famix';

const filePaths = ["new_test_src/generics/*.ts"];

const importer = new Importer();

const fmxRep = importer.famixRepFromSource('interface MyDaoInterface<T> {\n\
 }\n\
class MyDao<T> implements MyDaoInterface<T> {\n\
}\n\
');

describe('Tests for generics', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain two generic class", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterizableClass").size).toBe(2);
    });

    it("should contain a generic class MyDao that implements a generic interface MyDaoInterface", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const myDao = pList.find(p => p.getName() === "MyDao");
        expect(myDao).toBeTruthy();
        const myDaoInterface = pList.find(p => p.getName() === "MyDaoInterface");
        expect(myDaoInterface).toBeTruthy();
        if (myDao) {
            expect(myDao.getSubInheritances().size).toBe(0);
            expect(myDao.getSuperInheritances().size).toBe(1);
            const theInheritance = (Array.from(myDao.getSuperInheritances())[0]);
            expect(theInheritance.getSuperclass()).toBeTruthy();
            expect(theInheritance.getSuperclass()).toBe(myDaoInterface);
        }
        if (myDaoInterface) {
            expect(myDaoInterface.getSubInheritances().size).toBe(1);
            expect(myDaoInterface.getSuperInheritances().size).toBe(0);
            const theInheritance = (Array.from(myDaoInterface.getSubInheritances())[0]);
            expect(theInheritance.getSubclass()).toBeTruthy();
            expect(theInheritance.getSubclass()).toBe(myDao);
        }
    });
});
