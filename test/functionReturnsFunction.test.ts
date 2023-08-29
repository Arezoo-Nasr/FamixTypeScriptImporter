import { Importer } from '../src/analyze';
import { Function } from "../src/lib/famix/src/model/famix/function";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("functionReturnsFunction", 
    'export function deco() {\n\
    function fct() {\n\
        return function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {\n\
            const originalMethod = descriptor.value;\n\
            descriptor.value = function (...args: any[]) {\n\
                console.log(`Calling ${propertyKey} with arguments: ${JSON.stringify(args)}`);\n\
                const result = originalMethod.apply(this, args);\n\
                console.log(`Method ${propertyKey} returned: ${JSON.stringify(result)}`);\n\
                return result;\n\
            };\n\
            return descriptor;\n\
        };\n\
    }\n\
}\n\
');

describe('Tests for function returns function', () => {
    
    const functionList = fmxRep._getAllEntitiesWithType('Function');
    it("should have four functions", () => {
        expect(functionList?.size).toBe(4);
    });

    const theFunction = Array.from(functionList)[0] as Function;
    it("should contain a function 'deco'", () => {
        expect(theFunction).toBeTruthy();
        expect(theFunction?.getName()).toBe('deco');
    });

    const theFunction2 = Array.from(functionList)[1] as Function;
    it("should contain a function 'fct'", () => {
        expect(theFunction2).toBeTruthy();
        expect(theFunction2?.getName()).toBe('fct');
    });

    const theFunction3 = Array.from(functionList)[2] as Function;
    it("should contain a function 'logMethod'", () => {
        expect(theFunction3).toBeTruthy();
        expect(theFunction3?.getName()).toBe('logMethod');
    });

    const theFunction4 = Array.from(functionList)[3] as Function;
    it("should contain a function 'anonymous'", () => {
        expect(theFunction4).toBeTruthy();
        expect(theFunction4?.getName()).toBe('anonymous');
    });
});
