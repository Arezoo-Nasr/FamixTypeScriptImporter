import { TS2Famix } from '../src/ts2famix';
import { ParameterizableClass } from '../src/lib/famix/src/model/famix';

const filePaths = ["test_src/generics/**/*"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);

describe('generics ts2famix', () => {
    it("should verify generics...", () => {
        expect(fmxRep2).toBeTruthy()
    });
    it("should contain a generic class", () => {
        expect(fmxRep2.getAllEntitiesWithType("ParameterizableClass").length).toBe(1)
    });
    it("should contain a generic class MyDao", () => {
        expect((fmxRep2.getAllEntitiesWithType("ParameterizableClass")[0] as ParameterizableClass).getName()).toBe("MyDao")
    });
    it("should contain a generic class MyDao with a parameter type T", () => {
        expect((fmxRep2.getAllEntitiesWithType("ParameterizableClass")[0] as ParameterizableClass).getParameterTypes().size).toBe(1)
    });

});
