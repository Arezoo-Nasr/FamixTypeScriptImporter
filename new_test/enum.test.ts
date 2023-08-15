import { Importer } from '../src/analyze';
import { Access } from '../src/lib/famix/src/model/famix/access';
import { Enum } from '../src/lib/famix/src/model/famix/enum';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("enum", 
    'enum Weekday {\n\
    MONDAY = "Monday",\n\
    TUESDAY = "Tuesday",\n\
    WEDNESDAY = "Wednesday",\n\
    THURSDAY = "Thursday",\n\
    FRIDAY = "Friday",\n\
    SATURDAY = "Saturday",\n\
    SUNDAY = "Sunday"\n\
}\n\
\n\
const aDay: Weekday = Weekday.MONDAY;\n\
');

describe('Tests for enum', () => {
    
    it("should contain one enum with seven enum values", () => {
        expect(fmxRep._getAllEntitiesWithType("Enum").size).toBe(1);
        const theEnum = Array.from(fmxRep._getAllEntitiesWithType("Enum") as Set<Enum>)[0];
        expect(theEnum.getName()).toBe("Weekday");
        expect(theEnum.getValues().size).toBe(7);
    });
    
    it("should contain one access", () => {
        expect(fmxRep._getAllEntitiesWithType("Access").size).toBe(1);
        const theAccess = Array.from(fmxRep._getAllEntitiesWithType("Access") as Set<Access>)[0];
        expect(theAccess.getAccessor().getName()).toBe("enum.ts");
        expect(theAccess.getVariable().getName()).toBe("MONDAY");
    });    
});
