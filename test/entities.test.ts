import { TS2Famix } from '../src/ts2famix';
import { Method, Class, Type} from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/Entity.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);

describe('ts2famix', () => {

    it("should contain an EntityClass", () => {
        //const theClass = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "EntityClass"))[0];
        const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(theClass).toBeTruthy();
    })
    it("should contain an EntityClass with three methods.", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(theClass.getMethods().size).toBe(3);
    })
    it("should contain methods with correct names.", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        const mNames: Set<string> = new Set();
        theClass.getMethods().forEach(m => {
            //const entityCls = fmxRep2.getFamixElementById(m.ref as number) as Method;
            mNames.add(m.getName())
        });
        expect(mNames.has("move") &&
            mNames.has("move2") &&
            mNames.has("constructor")).toBe(true);
    })

    it("should contain methods with correct names.", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        const mNames: Set<string> = new Set();
        theClass.getMethods().forEach(m => {
            //const entityCls = fmxRep2.getFamixElementById(m.ref as number) as Method;
            mNames.add(m.getName())
        });
        expect(mNames.has("move") &&
            mNames.has("move2") &&
            mNames.has("constructor")).toBe(true);
    })

    it("should have a relationship between Class and Method.", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");

        const mNames: Set<Type> = new Set();
        theClass.getMethods().forEach(m => {
            //const entityCls = fmxRep2.getFamixElementById(m.ref as number) as Method;
            mNames.add(m.getParentType())
        });
        expect(mNames.size).toBe(1);
        expect(Array.from(mNames)[0]).toEqual(theClass)
    })

    it("should contain an EntityClass with one attribute.", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(theClass.getAttributes().size).toBe(1);
    })
    it("should contain an EntityClass with an attribute named 'name'.", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(Array.from(theClass.getAttributes())[0].getName()).toBe("name");
    })
    it("should contain an EntityClass with an attribute named 'name' of type string.", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(Array.from(theClass.getAttributes())[0].getDeclaredType().getName()).toBe("string");
    })
    it("should contain an EntityClass with one subclass", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(Array.from(theClass.getSubInheritances()).length).toBe(1);
    })
    it("should contain an EntityClass with one subclass named 'class2'", () => {
        const theClass = fmxRep2.getFamixClass("EntityClass");
        expect(Array.from(theClass.getSubInheritances())[0].getSubclass().getName()).toBe("class2");
    })

});
