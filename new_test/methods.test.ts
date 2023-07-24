//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';
import { Class } from "../src/lib/famix/src/model/famix/class";
import { Method } from "../src/lib/famix/src/model/famix/method";
import { LocalVariable } from "../src/lib/famix/src/model/famix/local_variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";


const importer = new Importer();

const fmxRep = importer.famixRepFromSource('class AAA {\n\
    public method(): void { }\n\
}\n\
');


describe('Tests for invocationWithVariable', () => {
    
    let methodList = fmxRep._getAllEntitiesWithType('Method');
    it("should have  method", () => {
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
