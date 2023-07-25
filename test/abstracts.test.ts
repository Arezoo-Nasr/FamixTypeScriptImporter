//import { TS2Famix } from '../src/ts2famix';
import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Method } from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/Abstracts.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPaths(filePaths);
const theClass = fmxRep2._getFamixClass("MyAbstractClass");
const theMethods = theClass?.getMethods();

describe('abstract classes and methods', () => {

    // Abstract classes and methods
    // export abstract class MyAbstractClass {
	// 	public abstract abstractMethod1();
	// 	public abstract abstractMethod2();
	// 	public concreteMethod() {};
	// }
    
    it("should contain an abstract class MyAbstractClass", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(true);
    });

    it("should contain an abstract method MyAbstractClass.abstractMethod1", () => {
        expect(theMethods).toBeTruthy();
        if (theMethods) {
            expect(theMethods.size).toBe(3);
            if (theMethods) {
                expect(theMethods.size).toBe(3);
                const foundMethodName = findMethodByName(theMethods, "abstractMethod1");
                expect(foundMethodName).toHaveLength(1);
                expect(foundMethodName[0].isAbstract).toBe(true);
            }
        }
    });
    it("should contain an abstract method MyAbstractClass.abstractMethod2", () => {
        expect(theMethods).toBeTruthy();
        if (theMethods) {
            expect(theMethods.size).toBe(3);
            const foundMethodName = findMethodByName(theMethods, "abstractMethod2");
            expect(foundMethodName).toHaveLength(1);
            expect(foundMethodName[0].isAbstract).toBe(true);
        }
    });
    it("should contain a concrete method MyAbstractClass.concreteMethod", () => {
        expect(theMethods).toBeTruthy();
        if (theMethods) {
            expect(theMethods.size).toBe(3);
            const foundMethodName = findMethodByName(theMethods, "concreteMethod");
            expect(foundMethodName).toHaveLength(1);
            expect(foundMethodName[0].isAbstract).toBe(false);
        }
    });

});

function findMethodByName(theMethods: Set<Method>, name: string) {
    return Array
        .from(theMethods)
        .map(m => { return { name: m.getName(), isAbstract: m.getIsAbstract() } })
        .filter(o => o.name == name);
}

