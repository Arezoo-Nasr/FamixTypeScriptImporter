import { Importer } from '../src/new-parsing-strategy/analyze';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource(
    'export class Animal {}\n\
export class Fish extends Animal {}\n\
export interface Flyable {}\n\
export class Bird extends Animal implements Flyable {}\n\
');

describe('Inheritance', () => {

    const jsonOutput = fmxRep.getJSON();
    const parsedModel = JSON.parse(jsonOutput);
    const idToElementMap = fmxRep._initMapFromModel(jsonOutput);    

    it("should contain a Fish class who has a superclass Animal", () => {
        const fishCls = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "Fish"))[0];
        const superInheritance = idToElementMap.get(fishCls.superInheritances[0].ref);
        expect(idToElementMap.get(superInheritance.superclass.ref).name).toBe("Animal"); // nom de la superclasse
    });

    it("should contain an Animal class who has a subclass Fish", () => {
        const animalCls = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "Animal"))[0];
        const subInheritance = idToElementMap.get(animalCls.subInheritances[0].ref);
        expect(idToElementMap.get(subInheritance.subclass.ref).name).toBe("Fish"); // nom de la superclasse
    });
    
    it("should contain a Flyable interface", () => {
        const flyableInterface = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "Flyable"))[0];
        expect(flyableInterface).toBeTruthy();
        expect(flyableInterface.isInterface).toBe(true);
    });
    
    it("should contain a Bird class who has a superclass Animal and implements a Flyable interface", () => {
        const animalCls = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "Animal"))[0];
        expect(animalCls).toBeTruthy();
        const flyableInterface = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "Flyable"))[0];
        expect(flyableInterface).toBeTruthy();
        const birdCls = parsedModel.filter(el => (el.FM3 === "FamixTypeScript.Class" && el.name === "Bird"))[0];
        expect(birdCls).toBeTruthy();
        const birdSuperInheritances = birdCls.superInheritances;
        // extends Animal, implements Flyable
        expect(birdSuperInheritances.length).toBe(2);
        const extendsRef = birdSuperInheritances.filter(si => (si.ref === animalCls.ref));
        expect(extendsRef).toBeTruthy();
        const interfaceRef = birdSuperInheritances.filter(si => (si.ref === flyableInterface.ref));
        expect(interfaceRef).toBeTruthy();
    });
});
