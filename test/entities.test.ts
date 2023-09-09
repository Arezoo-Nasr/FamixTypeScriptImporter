import { Project } from 'ts-morph';
import { Importer } from '../src/analyze';
import { Method, Function as FamixFunctionEntity, Variable} from '../src/lib/famix/src/model/famix';

const importer = new Importer();
const project = new Project();

project.createSourceFile("entities.ts",
`namespace MyNamespace {
    
    class EntityClass {
        public name: string;
        private p1: boolean; // type-only private
        #p2: boolean; // runtime private
        protected prot1: Map<any, any>;
        trustMe!: string;
        readonly ro = "yes";
        static #userCount: number;
        optional?: string;
        
        constructor() {}
        public move() {}
        private move2(family: string): void {}
        #move3() {}
    }
    
    class class2 extends EntityClass {}
    
    class clsInNsp {
        public static aStaticMethod() {}
    }
}

// global scope
var globalA;
function globalFunc() {}
`);

const fmxRep = importer.famixRepFromProject(project);

describe('Entities', () => {

    const theClass = fmxRep._getFamixClass("EntityClass");
    const theSubclass = fmxRep._getFamixClass("class2");

    it("should contain an EntityClass", () => {
        const theClass = fmxRep._getFamixClass("EntityClass");
        expect(theClass).toBeTruthy();
    });

    it("should contain an EntityClass with four methods", () => {
        const theClass = fmxRep._getFamixClass("EntityClass");
        if (theClass) expect(theClass.getMethods().size).toBe(4);
    });

    it("should contain methods with correct names", () => {
        if (theClass) {
            const mNames = fmxRep._methodNamesAsSetFromClass("EntityClass");    
            expect(mNames.has("move") &&
            mNames.has("move2") &&
            mNames.has("constructor")).toBe(true);
        } 
    });

    it("should contain a private method named move2 that returns void", () => {
        if (theClass) {
            const move2Method = fmxRep._getFamixMethod("move2");
            expect(move2Method).toBeTruthy();
            if (move2Method) {
                expect(move2Method.getIsPrivate()).toBe(true);
            }
        } 
    });
   
    it("should contain a private method named move2 with a signature 'private move2(family: string): void'", () => {
        if (theClass) {
            const move2Method = fmxRep._getFamixMethod("move2");
            expect(move2Method).toBeTruthy();
            if (move2Method) {
                expect(move2Method.getSignature()).toBe('private move2(family: string): void');
            }
        } 
    });

    it("should contain a constructor in EntityClass", () => {
        const theConstructor = fmxRep._getFamixMethod("constructor") as Method;
        expect(theConstructor).toBeTruthy();
        expect(theConstructor.getKind()).toBe("constructor");
    });

    it("should have a parent relationship between EntityClass and its methods", () => {
        if (theClass) { 
            const mParents = fmxRep._methodParentsAsSetFromClass("EntityClass");
            expect(mParents.size).toBe(1);
            expect(Array.from(mParents)[0]).toEqual(theClass);
        }
    });

    it("should contain an EntityClass with eight attributes", () => {
        expect(theClass?.getProperties().size).toBe(8);
    });

    it("should contain an EntityClass with an attribute named 'name' that is public", () => {
        if (theClass) {
            const nameAttribute = Array.from(theClass.getProperties())[0];
            expect(nameAttribute.getName()).toBe("name");
            expect(nameAttribute.getModifiers()).toContain("public");
        }
    });

    it("should contain an EntityClass with an attribute named 'name' of type string", () => {
        if (theClass) {
            expect(Array.from(theClass.getProperties())[0].getDeclaredType().getName()).toBe("string");
        }
    });

    it("should contain an EntityClass with an attribute named 'p1' that is private and of type boolean", () => {
        if (theClass) {
            const p1Attribute = Array.from(theClass.getProperties())[1];
            expect(p1Attribute.getName()).toBe("p1");
            expect(p1Attribute.getModifiers()).toContain("private");
            expect(p1Attribute.getDeclaredType().getName()).toBe("boolean");
        }
    });

    it("should contain an EntityClass with an attribute named '#p2' that is run-time private and of type boolean", () => {
        if (theClass) {
            const p2Attribute = Array.from(theClass.getProperties())[2];
            expect(p2Attribute.getName()).toBe("#p2");
            expect(p2Attribute.getDeclaredType().getName()).toBe("boolean");
        }
    });

    it("should contain an EntityClass with an attribute named 'prot1' that is protected and of type Map<any, any>", () => {
        if (theClass) {
            const prot1Attribute = Array.from(theClass.getProperties())[3];
            expect(prot1Attribute.getName()).toBe("prot1");
            expect(prot1Attribute.getModifiers()).toContain("protected");
            expect(prot1Attribute.getDeclaredType().getName()).toBe("Map<any, any>");
        }
    });

    it("should contain an EntityClass with an attribute named 'trustMe' that is guaranteed to be there (!) and of type string", () => {
        if (theClass) {
            const trustMeAttribute = Array.from(theClass.getProperties())[4];
            expect(trustMeAttribute.getName()).toBe("trustMe");
            expect(trustMeAttribute.getModifiers()).toContain("!");
            expect(trustMeAttribute.getDeclaredType().getName()).toBe("string");
        }
    });

    it("should contain an EntityClass with an attribute named 'ro' that is readonly and of type \"yes\"", () => {
        if (theClass) {
            const roAttribute = Array.from(theClass.getProperties())[5];
            expect(roAttribute.getName()).toBe("ro");
            expect(roAttribute.getModifiers()).toContain("readonly");
            expect(roAttribute.getDeclaredType().getName()).toBe('"yes"');
        }
    });

    it("should contain an EntityClass with an attribute named '#userCount' that is static and of type number", () => {
        if (theClass) {
            const userCountAttribute = Array.from(theClass.getProperties())[6];
            expect(userCountAttribute.getName()).toBe("#userCount");
            expect(userCountAttribute.getModifiers()).toContain("static");
            expect(userCountAttribute.getDeclaredType().getName()).toBe('number');
        }
    });

    it("should contain an EntityClass with an attribute named 'optional' that is optional (?) and of type string", () => {
        if (theClass) {
            const userCountAttribute = Array.from(theClass.getProperties())[7];
            expect(userCountAttribute.getName()).toBe("optional");
            expect(userCountAttribute.getModifiers()).toContain("?");
            expect(userCountAttribute.getDeclaredType().getName()).toBe('string');
        }
    });

    it("should contain an EntityClass with one subclass", () => {
        if (theClass) {
            expect(Array.from(theClass.getSubInheritances()).length).toBe(1);
        }
    });

    it("should contain an EntityClass with one subclass named 'class2'", () => {
        if (theClass) {
            const theClassSubclass = Array.from(theClass.getSubInheritances())[0].getSubclass();
            expect(theClassSubclass.getName()).toBe("class2");
            if (theSubclass) {
                expect(theSubclass).toBe(theClassSubclass);
            }
        }
    });

    it("should contain a clsInNsp with a class-side method named 'aStaticMethod'", () => {
        const clsInNSP = fmxRep._getFamixClass("clsInNsp");
        expect(clsInNSP).toBeTruthy();
        if (clsInNSP) {
            const aStaticMethod = Array.from(clsInNSP.getMethods()).find(m => m.getName() === 'aStaticMethod');
            expect(aStaticMethod).toBeTruthy();
            if (aStaticMethod) {
                expect(aStaticMethod.getIsClassSide()).toBe(true);
            }
        }
    });

    it("should contain a private method named '#move3'", () => {
        const cls = fmxRep._getFamixClass("EntityClass");
        expect(cls).toBeTruthy();
        if (cls) {
            const aMethod = Array.from(cls.getMethods()).find(m => m.getName() === '#move3');
            expect(aMethod).toBeTruthy();
            if (aMethod) {
                expect(aMethod.getIsPrivate()).toBe(true);
                expect(aMethod.getIsProtected()).toBe(false);
                expect(aMethod.getIsPublic()).toBe(false);
                expect(aMethod.getIsClassSide()).toBe(false);
            }
        }
    });

    // global scope
    it("should contain a function 'globalFunc' with global scope", () => {
        const globalFunc = fmxRep._getFamixFunction('globalFunc') as FamixFunctionEntity;
        expect(globalFunc).toBeTruthy();
        expect(globalFunc.getName()).toBe('globalFunc');
        expect(globalFunc.getParentContainerEntity().getName()).toBe('entities.ts');
    });

    it("should contain a variable 'globalA' with global scope", () => {
        const list = Array.from(fmxRep._getAllEntitiesWithType("Variable") as Set<Variable>);
        expect(list).toBeTruthy();
        const globalVar = list.find(p => p.getName() === "globalA");
        expect(globalVar).toBeTruthy();
    });
});
