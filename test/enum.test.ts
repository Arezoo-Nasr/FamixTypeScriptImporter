import { Importer } from '../src/analyze';
import { Access } from '../src/lib/famix/src/model/famix/access';
import { Enum } from '../src/lib/famix/src/model/famix/enum';
import { ScriptEntity } from '../src/lib/famix/src/model/famix/script_entity';

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
    
    const theFile = Array.from(fmxRep._getAllEntitiesWithType("ScriptEntity") as Set<ScriptEntity>)[0];

    it("should contain one enum with seven enum values", () => {
        expect(fmxRep._getAllEntitiesWithType("Enum").size).toBe(1);
        const theEnum = Array.from(fmxRep._getAllEntitiesWithType("Enum") as Set<Enum>)[0];
        expect(theFile.getTypes().has(theEnum)).toBe(true);
        expect(theEnum.getName()).toBe("Weekday");
        expect(theEnum.getValues().size).toBe(7);
        expect(Array.from(theEnum.getValues())[0].getName()).toBe("MONDAY");
        expect(Array.from(theEnum.getValues())[1].getName()).toBe("TUESDAY");
        expect(Array.from(theEnum.getValues())[2].getName()).toBe("WEDNESDAY");
        expect(Array.from(theEnum.getValues())[3].getName()).toBe("THURSDAY");
        expect(Array.from(theEnum.getValues())[4].getName()).toBe("FRIDAY");
        expect(Array.from(theEnum.getValues())[5].getName()).toBe("SATURDAY");
        expect(Array.from(theEnum.getValues())[6].getName()).toBe("SUNDAY");
        expect(Array.from(theEnum.getValues())[0].getParentEntity()).toBe(theEnum);
        expect(Array.from(theEnum.getValues())[1].getParentEntity()).toBe(theEnum);
        expect(Array.from(theEnum.getValues())[2].getParentEntity()).toBe(theEnum);
        expect(Array.from(theEnum.getValues())[3].getParentEntity()).toBe(theEnum);
        expect(Array.from(theEnum.getValues())[4].getParentEntity()).toBe(theEnum);
        expect(Array.from(theEnum.getValues())[5].getParentEntity()).toBe(theEnum);
        expect(Array.from(theEnum.getValues())[6].getParentEntity()).toBe(theEnum);
    });
    
    it("should contain one access", () => {
        expect(fmxRep._getAllEntitiesWithType("Access").size).toBe(1);
        const theAccess = Array.from(fmxRep._getAllEntitiesWithType("Access") as Set<Access>)[0];
        expect(theFile.getAccesses().has(theAccess)).toBe(true);
        expect(theAccess.getAccessor().getName()).toBe("enum.ts");
        expect(theAccess.getVariable().getName()).toBe("MONDAY");
    });    
});
