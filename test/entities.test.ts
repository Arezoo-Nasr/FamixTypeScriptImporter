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

    it("should contain a constructor in EntityClass", () => {
        const theConstructor = fmxRep2.getFamixElementByFullyQualifiedName("MyNamespace.EntityClass.__constructor") as Method;
        expect(theConstructor).toBeTruthy();
        expect(theConstructor.getIsConstructor()).toBe(true);
    })

    it("should have a parent relationship between EntityClass and its methods.", () => {
        if (theClass) { 
            const mParents = methodParentsAsSetFromClass(theClass);
            expect(mParents.size).toBe(1);
            expect(Array.from(mParents)[0]).toEqual(theClass)
        }
    })

    it("should contain an EntityClass with one attribute.", () => {
        expect(theClass?.getAttributes().size).toBe(1);
    })
    it("should contain an EntityClass with an attribute named 'name'.", () => {
        if (theClass) {
            expect(Array.from(theClass.getAttributes())[0].getName()).toBe("name");
        }
    })
    it("should contain an EntityClass with an attribute named 'name' of type string.", () => {
        if (theClass) {
            expect(Array.from(theClass.getAttributes())[0].getDeclaredType().getName()).toBe("string");
        }
    })
    it("should contain an EntityClass with one subclass", () => {
        if (theClass) {
            expect(Array.from(theClass.getSubInheritances()).length).toBe(1);
        }
    })
    it("should contain an EntityClass with one subclass named 'class2'", () => {
        if (theClass) {
            const theClassSubclass = Array.from(theClass.getSubInheritances())[0].getSubclass();
            expect(theClassSubclass.getName()).toBe("class2");
            if (theSubclass) {
                expect(theSubclass).toBe(theClassSubclass);
            }
        }
    })

    it("should contain an clsInNsp with a static named 'aStaticMethod'", () => {
        const clsInNSP = fmxRep2.getFamixClass("clsInNsp");
        expect(clsInNSP).toBeTruthy();
        if (clsInNSP) {
            // const methodNames = methodNamesAsSetFromClass(clsInNSP);
            // expect(methodNames.has("aStaticMethod")).toBe(true);
            const aStaticMethod = Array.from(clsInNSP.getMethods()).find(m => m.getName() == 'aStaticMethod');
            expect(aStaticMethod).toBeTruthy();
            if (aStaticMethod) {
                expect(aStaticMethod.getIsStatic()).toBe(true);
            }
        }
    })

});
function methodNamesAsSetFromClass(theClass: Class) {
    return new Set(Array.from(theClass.getMethods()).map(m => m.getName()));
}

function methodParentsAsSetFromClass(theClass: Class) {
    return new Set(Array.from(theClass.getMethods()).map(m => m.getParentType()));
}
