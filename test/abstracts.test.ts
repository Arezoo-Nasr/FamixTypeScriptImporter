import { Importer } from '../src/new-parsing-strategy/analyze';
import { Method } from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/Abstracts.ts"];
const importer = new Importer();

const fmxRep2 = importer.famixRepFromPaths(filePaths);
const theClass = fmxRep2._getFamixClass("MyAbstractClass");
const theMethods = theClass?.getMethods();

describe('Abstract classes and methods', () => {

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
                const foundMethodName = fmxRep2._getFamixMethod("abstractMethod1") as Method;
                expect(foundMethodName.getIsAbstract()).toBe(true);
            }
        }
    });

    it("should contain an abstract method MyAbstractClass.abstractMethod2", () => {
        expect(theMethods).toBeTruthy();
        if (theMethods) {
            expect(theMethods.size).toBe(3);
            const foundMethodName = fmxRep2._getFamixMethod("abstractMethod2") as Method;
            expect(foundMethodName.getIsAbstract()).toBe(true);
        }
    });

    it("should contain a concrete method MyAbstractClass.concreteMethod", () => {
        expect(theMethods).toBeTruthy();
        if (theMethods) {
            expect(theMethods.size).toBe(3);
            const foundMethodName = fmxRep2._getFamixMethod("concreteMethod") as Method;
            expect(foundMethodName.getIsAbstract()).toBe(false);
        }
    });
});
