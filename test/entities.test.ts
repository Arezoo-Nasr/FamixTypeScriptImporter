import { TS2Famix } from '../src/ts2famix';
import { Method, Class, Type} from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/Entity.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);

const theClass = fmxRep2.getFamixClass("EntityClass");
const theSubclass = fmxRep2.getFamixClass("class2");

describe('ts2famix', () => {

    it("should contain an EntityClass", () => {
        //const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(theClass).toBeTruthy();
    })
    it("should contain an EntityClass with three methods.", () => {
        //const theClass = fmxRep2.getFamixClass("EntityClass");
        if (theClass) expect(theClass.getMethods().size).toBe(3);
    })
    it("should contain methods with correct names.", () => {
        if (theClass) {
            const mNames = methodNamesAsSetFromClass(theClass);    
            expect(mNames.has("move") &&
            mNames.has("move2") &&
            mNames.has("constructor")).toBe(true);
        } 
    });

    it("should contain a private method named move2 that returns void.", () => {
        if (theClass) {
            const move2Method = methodByNameFromClass("move2", theClass);
            expect(move2Method).toBeTruthy();
            if (move2Method) {
                expect(move2Method.getIsPrivate()).toBe(true);
            }
        } 
    });
   
    it("should contain a private method named move2 with a signature 'private move2(family: string): void'.", () => {
        if (theClass) {
            const move2Method = methodByNameFromClass("move2", theClass);
            expect(move2Method).toBeTruthy();
            if (move2Method) {
                expect(move2Method.getSignature()).toBe('private move2(family: string): void');
            }
        } 
    });

    it("should contain a constructor in EntityClass", () => {
        const theConstructor = fmxRep2.getFamixContainerEntityElementByFullyQualifiedName("MyNamespace.EntityClass.__constructor") as Method;
        expect(theConstructor).toBeTruthy();
        expect(theConstructor.getIsConstructor()).toBe(true);
    })

    it("should have a parent relationship between EntityClass and its methods.", () => {
        if (theClass) { 
            const mParents = methodParentsAsSetFromClass(theClass);
            expect(mParents.size).toBe(1);
            expect(Array.from(mParents)[0]).toEqual(theClass)
        }
    });

    it("should contain an EntityClass with eight attributes.", () => {
        expect(theClass?.getAttributes().size).toBe(8);
    });
    it("should contain an EntityClass with an attribute named 'name' that is public.", () => {
        if (theClass) {
            const nameAttribute = Array.from(theClass.getAttributes())[0];
            expect(nameAttribute.getName()).toBe("name");
            expect(nameAttribute.getModifiers()).toContain("public");
        }
    });
    it("should contain an EntityClass with an attribute named 'name' of type string.", () => {
        if (theClass) {
            expect(Array.from(theClass.getAttributes())[0].getDeclaredType().getName()).toBe("string");
        }
    });
    it("should contain an EntityClass with an attribute named 'p1' that is private and of type boolean.", () => {
        if (theClass) {
            const p1Attribute = Array.from(theClass.getAttributes())[1];
            expect(p1Attribute.getName()).toBe("p1");
            expect(p1Attribute.getModifiers()).toContain("private");
            expect(p1Attribute.getDeclaredType().getName()).toBe("boolean");
        }
    });
    it("should contain an EntityClass with an attribute named '#p2' that is run-time private and of type boolean.", () => {
        if (theClass) {
            const p2Attribute = Array.from(theClass.getAttributes())[2];
            expect(p2Attribute.getName()).toBe("#p2");
            //expect(p2Attribute.getModifiers()).toContain("private");
            expect(p2Attribute.getDeclaredType().getName()).toBe("boolean");
        }
    });

    it("should contain an EntityClass with an attribute named 'prot1' that is protected and of type Map<any, any>.", () => {
        if (theClass) {
            const prot1Attribute = Array.from(theClass.getAttributes())[3];
            expect(prot1Attribute.getName()).toBe("prot1");
            expect(prot1Attribute.getModifiers()).toContain("protected");
            expect(prot1Attribute.getDeclaredType().getName()).toBe("Map<any, any>");
        }
    });
    it("should contain an EntityClass with an attribute named 'trustMe' that is guaranteed to be there (!) and of type string.", () => {
        if (theClass) {
            const trustMeAttribute = Array.from(theClass.getAttributes())[4];
            expect(trustMeAttribute.getName()).toBe("trustMe");
            expect(trustMeAttribute.getModifiers()).toContain("!");
            expect(trustMeAttribute.getDeclaredType().getName()).toBe("string");
        }
    });
    it("should contain an EntityClass with an attribute named 'ro' that is readonly and of type \"yes\".", () => {
        if (theClass) {
            const roAttribute = Array.from(theClass.getAttributes())[5];
            expect(roAttribute.getName()).toBe("ro");
            expect(roAttribute.getModifiers()).toContain("readonly");
            expect(roAttribute.getDeclaredType().getName()).toBe('"yes"');
        }
    });
    it("should contain an EntityClass with an attribute named '#userCount' that is static and of type number.", () => {
        if (theClass) {
            const userCountAttribute = Array.from(theClass.getAttributes())[6];
            expect(userCountAttribute.getName()).toBe("#userCount");
            expect(userCountAttribute.getModifiers()).toContain("static");
            expect(userCountAttribute.getDeclaredType().getName()).toBe('number');
        }
    });
    it("should contain an EntityClass with an attribute named 'optional' that is optional (?) and of type string.", () => {
        if (theClass) {
            const userCountAttribute = Array.from(theClass.getAttributes())[7];
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

    it("should contain an clsInNsp with a class-side method named 'aStaticMethod'", () => {
        const clsInNSP = fmxRep2.getFamixClass("clsInNsp");
        expect(clsInNSP).toBeTruthy();
        if (clsInNSP) {
            const aStaticMethod = Array.from(clsInNSP.getMethods()).find(m => m.getName() == 'aStaticMethod');
            expect(aStaticMethod).toBeTruthy();
            if (aStaticMethod) {
                expect(aStaticMethod.getIsClassSide()).toBe(true);
            }
        }
    });

});
function methodNamesAsSetFromClass(theClass: Class) {
    return new Set(Array.from(theClass.getMethods()).map(m => m.getName()));
}

function methodParentsAsSetFromClass(theClass: Class) {
    return new Set(Array.from(theClass.getMethods()).map(m => m.getParentType()));
}
function methodByNameFromClass(methodName: string, theClass: Class) {
    return Array.from(theClass.getMethods()).find(m => m.getName() == methodName);
}

