import { Importer } from '../src/new-parsing-strategy/analyze';
import { Method } from "../src/lib/famix/src/model/famix/method";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("methods", 
    'class AAA {\n\
    public method(): void {}\n\
}\n\
');

describe('Tests for methods', () => {
    
    const methodList = fmxRep._getAllEntitiesWithType('Method');
    it("should have method", () => {
        expect(methodList?.size).toBe(1);
    });

    const theMethod = Array.from(methodList)[0] as Method;
    it("should contain a method 'method'", () => {
        expect(theMethod).toBeTruthy();
        expect(theMethod?.getName()).toBe('method');
    });


    it("should return void", () => {
        expect(theMethod?.getDeclaredType().getName()).toBe("void");
    });

    it("should have no parameter", () => {
        expect(theMethod?.getParameters().size).toBe(0);
    });

    it("should be a public method 'method", () => {
        expect(theMethod.getIsAbstract()).toBe(false);
        expect(theMethod.getIsConstructor()).toBe(false);
        expect(theMethod.getIsClassSide()).toBe(false);
        expect(theMethod.getIsPrivate()).toBe(false);
        expect(theMethod.getIsProtected()).toBe(false);
        expect(theMethod.getIsPublic()).toBe(true);
    });
});
