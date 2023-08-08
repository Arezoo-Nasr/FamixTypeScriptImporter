import { Importer } from '../src/analyze';
import { Method } from '../src/lib/famix/src/model/famix';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("abstracts", 
    'abstract class MyAbstractClass {\n\
    public abstract abstractMethod1();\n\
    public abstract abstractMethod2();\n\
    public concreteMethod() {}\n\
}\n\
');

describe('Abstract classes and methods', () => {

    const theClass = fmxRep._getFamixClass("MyAbstractClass");
    const theMethods = theClass?.getMethods();

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
                const foundMethodName = fmxRep._getFamixMethod("abstractMethod1") as Method;
                expect(foundMethodName.getIsAbstract()).toBe(true);
            }
        }
    });

    it("should contain an abstract method MyAbstractClass.abstractMethod2", () => {
        expect(theMethods).toBeTruthy();
        if (theMethods) {
            expect(theMethods.size).toBe(3);
            const foundMethodName = fmxRep._getFamixMethod("abstractMethod2") as Method;
            expect(foundMethodName.getIsAbstract()).toBe(true);
        }
    });

    it("should contain a concrete method MyAbstractClass.concreteMethod", () => {
        expect(theMethods).toBeTruthy();
        if (theMethods) {
            expect(theMethods.size).toBe(3);
            const foundMethodName = fmxRep._getFamixMethod("concreteMethod") as Method;
            expect(foundMethodName.getIsAbstract()).toBe(false);
        }
    });
});
