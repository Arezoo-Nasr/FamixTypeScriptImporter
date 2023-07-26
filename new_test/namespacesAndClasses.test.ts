import { Importer } from '../src/new-parsing-strategy/analyze';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource(
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

    const theNamespace1 = fmxRep._getFamixNamespace("MyNamespace");
    it("should contain a namespace MyNamespace", () => {
        expect(theNamespace1).toBeTruthy();
    });

    it("should contain 2 classes", () => {
        expect(theNamespace1?.getClasses().size).toBe(2);
    });

    const theNamespace2 = fmxRep._getFamixNamespace("Nsp3");
    it("should contain a namespace Nsp3", () => {
        expect( theNamespace2 ).toBeTruthy();
    });
    
    it("should contain 2 classes", () => {
        expect(theNamespace2?.getClasses().size).toBe(1);
    });

    it("should contain four classes", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(4);
    });

    it("should contain a class EntityClass", () => {
        expect( fmxRep._getFamixClass("EntityClass") ).toBeTruthy();
    });

    it("should contain a class class2", () => {
        expect( fmxRep._getFamixClass("class2") ).toBeTruthy();
    });

    it("should contain a class clsInNsp3", () => {
        expect( fmxRep._getFamixClass("clsInNsp3") ).toBeTruthy();
    });

    it("should contain a class clsOutNsp", () => {
        expect( fmxRep._getFamixClass("clsOutNsp") ).toBeTruthy();
    });
});
