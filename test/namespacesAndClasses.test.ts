import { Importer } from '../src/analyze';
import { Type } from '../src/lib/famix/src/model/famix/type';
import { Class } from '../src/lib/famix/src/model/famix/class';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("namespacesAndClasses", 
    'namespace MyNamespace {\n\
	class EntityClass {}\n\
	class class2 {}\n\
}\n\
\n\
class clsOutNsp {}\n\
\n\
namespace Nsp3 {\n\
	class clsInNsp3 {}\n\
}\n\
');

describe('Tests for namespaces and classes', () => {
    
    it("should contain two namespaces", () => {
        expect(fmxRep._getFamixNamespaces().size).toBe(2);
    });

    const theFile = fmxRep._getFamixFile("namespacesAndClasses.ts");
    const theNamespace1 = fmxRep._getFamixNamespace("MyNamespace");
    it("should contain a namespace MyNamespace", () => {
        expect(theNamespace1).toBeTruthy();
        expect(theNamespace1?.getParentScope()).toBe(theFile);
    });

    it("should contain two classes", () => {
        expect(Array.from(theNamespace1?.getTypes() as Set<Type>).filter(t => (t instanceof Class)).length).toBe(2);
    });

    const theNamespace2 = fmxRep._getFamixNamespace("Nsp3");
    it("should contain a namespace Nsp3", () => {
        expect(theNamespace2).toBeTruthy();
        expect(theNamespace2?.getParentScope()).toBe(theFile);
    });
    
    it("should contain one class", () => {
        expect(Array.from(theNamespace2?.getTypes() as Set<Type>).filter(t => (t instanceof Class)).length).toBe(1);
    });

    it("should contain four classes", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(4);
    });

    it("should contain a class EntityClass", () => {
        expect(fmxRep._getFamixClass("EntityClass")).toBeTruthy();
    });

    it("should contain a class class2", () => {
        expect(fmxRep._getFamixClass("class2")).toBeTruthy();
    });

    it("should contain a class clsInNsp3", () => {
        expect(fmxRep._getFamixClass("clsInNsp3")).toBeTruthy();
    });

    it("should contain a class clsOutNsp", () => {
        expect(fmxRep._getFamixClass("clsOutNsp")).toBeTruthy();
    });
});
