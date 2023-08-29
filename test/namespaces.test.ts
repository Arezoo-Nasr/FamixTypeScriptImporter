import { Importer } from '../src/analyze';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("namespaces", 
    'namespace MyNamespace {}\n\
\n\
module MyModule {}\n\
\n\
declare module aModule {}\n\
\n\
declare module "someModule" {}\n\
\n\
declare module "otherModule";\n\
\n\
declare namespace MyNamespace2 {}\n\
');

describe('Tests for namespaces', () => {
    
    it("should contain six namespaces", () => {
        expect(fmxRep._getFamixNamespaces().size).toBe(6);
    });

    const theNamespace1 = fmxRep._getFamixNamespace("MyNamespace");
    it("should contain a namespace MyNamespace", () => {
        expect(theNamespace1).toBeTruthy();
    });

    const theNamespace2 = fmxRep._getFamixNamespace("MyModule");
    it("should contain a namespace MyModule", () => {
        expect(theNamespace2).toBeTruthy();
    });

    const theNamespace3 = fmxRep._getFamixNamespace("aModule");
    it("should contain a namespace aModule", () => {
        expect(theNamespace3).toBeTruthy();
    });

    const theNamespace4 = fmxRep._getFamixNamespace("\"someModule\"");
    it("should contain a namespace \"someModule\"", () => {
        expect(theNamespace4).toBeTruthy();
    });

    const theNamespace5 = fmxRep._getFamixNamespace("\"otherModule\"");
    it("should contain a namespace \"otherModule\"", () => {
        expect(theNamespace5).toBeTruthy();
    });

    const theNamespace6 = fmxRep._getFamixNamespace("MyNamespace2");
    it("should contain a namespace MyNamespace2", () => {
        expect(theNamespace6).toBeTruthy();
    });
});
