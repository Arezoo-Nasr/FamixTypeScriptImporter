import * as fs from 'fs';
import yargs from 'yargs';

const argv = yargs
    .example('$0 -i ts-model.json -o ts-model.puml', 'creates PlantUML class diagram from JSON-format model of typescript project')
    .alias('i', 'input')
    .nargs('i', 1)
    .alias('o', 'output')
    .nargs('o', 1)
    .demandOption('input').demandOption('output').argv;

const INHERITANCE_LINK_COLOR = 'blue';

// approximation for code completion
interface FamixTypeScriptElement {
    FM3: string
    name: string
    id?: string
}

interface Association {
    from: string;
    to: string;
    name: string;
}

const jsonFileName = argv.input as string;
const parsedModel: Array<FamixTypeScriptElement> = JSON.parse(fs.readFileSync(jsonFileName, 'utf-8'));
const classNameMap = new Map<string, string>();
const associations = new Array<Association>();

// map all the classnames to their ids
parsedModel.forEach(element => {
    // Map has id as key and unique (plantuml) class name
    classNameMap.set(element.id, uniqueElementName(element));
    const nameWithoutPrefix = element.FM3.split('.')[1];
    // special case association
    if (nameWithoutPrefix.endsWith('Inheritance')) {
        const subclass = element['subclass'].ref;
        const superclass = element['superclass'].ref;
        associations.push({ from: subclass, to: superclass, name: nameWithoutPrefix });
    }
});

// generate plantuml
let plantUMLOutString = `@startuml
skinparam style strictuml
title Object diagram for ${jsonFileName}
`;
parsedModel.forEach(element => {
    plantUMLOutString += `${toPlantUML(element)}\n`;
});

// create associations
associations.forEach(association => {
    // Inheritance is a special case - show it in UML even though it doesn't make 100% sense in object diagrams
    const isInheritance = association.name.startsWith('Inheritance');
    if (isInheritance) {
        plantUMLOutString += `${classNameMap.get(association.from)} --|> ${classNameMap.get(association.to)} #line:${INHERITANCE_LINK_COLOR}\n`;
    } else {
        plantUMLOutString += `${classNameMap.get(association.from)} ..> "${association.name}" ${classNameMap.get(association.to)}\n`;
    }
});

plantUMLOutString += '@enduml';

// write to output file
fs.writeFile(argv.output as string, plantUMLOutString, (err) => {
    if (err) { throw err; }
});

function uniqueElementName(element: FamixTypeScriptElement): string {
    // console.error(`uniqueElementName for ${JSON.stringify(element)}`);
    return `${element.FM3}${element.id}`;
}

function toPlantUML(element: FamixTypeScriptElement) {
    let plantUMLString = '';
    const optionalName = element.name || '';
    const nameWithoutPrefix = element.FM3.split('.')[1];
    plantUMLString += `object "${optionalName}:${nameWithoutPrefix}" as ${uniqueElementName(element)} {\n`;
    plantUMLString += `id = ${element.id}\n`;
    plantUMLString += propertiesToPlantUML(element);
    plantUMLString += '}\n';
    return plantUMLString;
}

function propertiesToPlantUML(element: FamixTypeScriptElement) {
    let plantUMLString = '';
    // element.attrs.forEach(attr => {
    for (const property in element) {
        const attribute = element[property];
        const isOneToManyReference = typeof attribute !== 'string' && attribute.length; // Array but not a string

        switch (property) {
            // ignore these properties
            case 'subclass':
            case 'superclass':
            case 'FM3':
            case 'id':
            case 'name':
                break;

            default:
                if (isOneToManyReference) {
                    attribute.forEach((composite, index) => {
                        associations.push({ from: element.id, to: composite.ref, name: `${property}[${index}]` });
                    });
                } else if (typeof attribute === 'object') {
                    associations.push({ from: element.id, to: attribute.ref, name: property });
                } else {  // typeof string, boolean, number, etc.
                    // treat it as a simple attribute
                    plantUMLString += `${property} = ${element[property]}\n`;
                }

                break;
        }
    }
    return plantUMLString;
}
