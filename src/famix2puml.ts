import { FamixTypeScriptRepository, FamixTypeScriptElement, FamixTypeScriptAttr } from './lib/famix-ts-model';
import * as fs from 'fs';
import yargs from 'yargs';
// import { MSEDocument, Element, Attr } from "./src/MSEDocument";

const argv = yargs
    .example('$0 -i ts-model.json -o ts-model.puml', 'creates PlantUML class diagram from JSON-format model of typescript project')
    .alias('i', 'input')
    .nargs('i', 1)
    .alias('o', 'output')
    .nargs('o', 1)
    .demandOption('input').demandOption('output').argv;

const INHERITANCE_LINK_COLOR = '#orange';
interface Association {
    from: string;
    to: string;
    name: string;
}

// Load the JSON Famix file, this should ideally not be hard-coded
const jsonFileName = argv.input as string;
let parsedModel: Array<FamixTypeScriptElement> = JSON.parse(fs.readFileSync(jsonFileName, 'utf-8'));
// const mseJSON:MSEDocument =  new MSEDocument(parser.parse(sampleMSE));

// const sampleJavaFileNote = 'note-with-source.puml';
// let sampleJavaFileNotePUML = fs.readFileSync(sampleJavaFileNote, 'utf-8');

const classNameMap = new Map<string, string>();
const associations = new Array<Association>();

// write out JSON for debugging
//fs.writeFileSync(mseFileName + '.json', JSON.stringify(mseJSON));

// map all the classnames to their ids
parsedModel.forEach(element => {
    // Map has id as key and unique (plantuml) class name
    classNameMap.set(element.id, uniqueElementName(element));
    if (element.FM3.endsWith('Inheritance')) {
        // special case association
        let subclass = refForAttr(element, 'subclass');
        let superclass = refForAttr(element, 'superclass');
        associations.push({ from: subclass, to: superclass, name: uniqueElementName(element) })
    }
});

// generate plantuml
console.log('@startuml');
console.log('skinparam style strictuml');
console.log('title Object diagram for ' + jsonFileName + '\n');
//console.log(sampleJavaFileNotePUML); // put the note in the UML, don't use for general case
parsedModel.forEach(element => {
    console.log(toPlantUML(element));
});

// create associations
associations.forEach(association => {
    // Inheritance is a special case - show it in UML even though it doesn't make 100% sense in object diagrams
    const isInheritance = association.name.startsWith('Inheritance');
    if (isInheritance) {
        console.log(`${classNameMap.get(association.from)} --|> ${classNameMap.get(association.to)} #line:blue`);
        console.log(`${classNameMap.get(association.from)} .[${INHERITANCE_LINK_COLOR}]. ${association.name}`);
        console.log(`${classNameMap.get(association.to)} .[${INHERITANCE_LINK_COLOR}]. ${association.name}`);
    } else {
        console.log(`${classNameMap.get(association.from)} ..> "${association.name}" ${classNameMap.get(association.to)}`);
    }
});

console.log('@enduml')

function uniqueElementName(element: FamixTypeScriptElement): string {
    // console.error(`uniqueElementName for ${JSON.stringify(element)}`);
    return `${element.FM3}${element.id}`
}

function toPlantUML(element: FamixTypeScriptElement) {
    let plantUMLString: string = '';
    let optionalName = element.name || '';
    let nameWithoutPrefix = element.FM3.split('.')[1];
    plantUMLString += `object "${optionalName}:${nameWithoutPrefix}" as ${uniqueElementName(element)} {\n`;
    plantUMLString += `id = ${element.id}\n`;
    plantUMLString += attrToPlantUML(element);
    plantUMLString += '}\n';
    return plantUMLString;
}

function attrToPlantUML(element: FamixTypeScriptElement) {
    var plantUMLString: string = '';
    // element.attrs.forEach(attr => {
    for (const attr in element) {
        switch (attr) {
            // ignore these properties
            case 'subclass':
            case 'superclass':
            case 'FM3':
            case 'id':
            case 'name':
                break;

            // get one-to-many references
            case 'types':
            case 'structuresWithDeclaredType':
            case 'behavioursWithDeclaredType':
            case 'methods':
            case 'containers':
            case 'incomingAccesses':
            case 'accesses':
            case 'localVariables':
            case 'outgoingInvocations':
            case 'receivingInvocations':
                element[attr].forEach((composite, index) => {
                    associations.push({ from: element.id, to: composite.ref, name: `${attr}[${index}]` })
                });
                break;

            // get references
            case 'receiver':
            case 'sender':
            case 'container':
            case 'parameterizableClass':
            case 'typeContainer':
            case 'element':
            case 'declaredType':
            case 'previous':
            case 'parentNamespace':
            case 'accessor':
            case 'variable':
            case 'parentType':
            case 'parentBehaviouralEntity':
            case 'sourceAnchor':
                associations.push({ from: element.id, to: element[attr].ref, name: attr });
                break;
            default:
                // treat it as an attribute
                plantUMLString += `${attr} = ${element[attr]}\n`
                break;
        }
    }
    return plantUMLString;
}

function refForAttr(element: FamixTypeScriptElement, attrKey: string): string {
    return element.attrs.filter(attr => attr.name == attrKey)[0].vals[0].ref;
}
