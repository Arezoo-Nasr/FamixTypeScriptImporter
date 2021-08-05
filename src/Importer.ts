import {
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, InterfaceDeclaration
    , MethodDeclaration, ModuleDeclaration, Project, PropertyDeclaration, SourceFile, SyntaxKind
} from "ts-morph";

import * as Famix from "./lib/famix/src/model/famix";
import * as fs from "fs"
import { FamixRepository } from "./lib/famix/src/famix_repository";

const project = new Project();
var fmxRep = new FamixRepository();
var fmxTypes = new Map<string, Famix.Type>();
var allClasses = [];
var allInterfaces = [];
const filePaths = ["./resources/**.ts",]; //Arezoo

try {
    let fmxNamespacesMap = new Map<string, Famix.Namespace>();
    const sourceFiles = project.addSourceFilesAtPaths(filePaths);
    sourceFiles.forEach(file => {

        let namespaceName: string;
        let fmxNamespace: Famix.Namespace;
        let interfacesInFile: InterfaceDeclaration[];
        let classesInFile: ClassDeclaration[];

        let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(file.getFilePath());
        fmxIndexFileAnchor.setStartPos(file.getStart());
        fmxIndexFileAnchor.setEndPos(file.getEnd());

        if (file.getModules().length > 0) {
            file.getModules().forEach(namespace => {
                namespaceName = namespace.getName();
                fmxNamespace = checkFamixNamespace(fmxNamespacesMap, namespaceName);
                classesInFile = namespace.getClasses();
                //get functions //get global var
                //interfaces = namespace.getInterfaces();

                let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
                fmxIndexFileAnchor.setFileName(file.getFilePath());
                fmxIndexFileAnchor.setStartPos(namespace.getStart());
                fmxIndexFileAnchor.setEndPos(namespace.getEnd());
                fmxIndexFileAnchor.setElement(fmxNamespace);

                setElemntsInModule(classesInFile, file, fmxNamespace);
            });
        }
        if (file.getClasses().length > 0) {
            //Arezoo  if there is not any classes but also it must be executed for global variables,functions,etc.
            namespaceName = "DefaultNamespace";
            fmxNamespace = checkFamixNamespace(fmxNamespacesMap, namespaceName);
            classesInFile = file.getClasses();
            //get functions
            //interfaces = file.getInterfaces();
            setElemntsInModule(classesInFile, file, fmxNamespace);
        }
    });

    var mse = fmxRep.getMSE();
    fs.writeFile('sample1.json', mse, (err) => {
        if (err) { throw err; }
    });
}
catch (Error) {
    console.log(Error.message);
}

//Arezoo
function setElemntsInModule(classesInFile: ClassDeclaration[], file: SourceFile, fmxNamespace: Famix.Namespace) {

    allClasses.push(...classesInFile);   //????????????????????
    //allInterfaces.push(...interfaces);
    classesInFile.forEach(cls => {
        var fmxClass = createFamixClass(cls, file);
        fmxNamespace.addTypes(fmxClass);

        cls.getMethods().forEach(method => {
            var fmxMethod = createFamixMethod(method, file);
            fmxClass.addMethods(fmxMethod);
        });

        cls.getProperties().forEach(prop => {
            var fmxAttr = createFamixAttribute(prop, file);
            fmxClass.addAttributes(fmxAttr);
        });

        cls.getConstructors().forEach(cstr => {
            var fmxMethod = createFamixMethod(cstr, file, false, true);
            fmxClass.addMethods(fmxMethod);
        });
    });

}
//Arezoo
function checkFamixNamespace(fmxNamespacesMap: Map<string, Famix.Namespace>, namespaceName: string): Famix.Namespace {
    let fmxNamespace: Famix.Namespace;

    if (!fmxNamespacesMap.has(namespaceName)) {
        fmxNamespace = new Famix.Namespace(fmxRep);
        fmxNamespace.setName(namespaceName);
        fmxNamespacesMap[namespaceName] = fmxNamespace;
    }
    else {
        fmxNamespace = fmxNamespacesMap[namespaceName];
    }

    return fmxNamespace;
}

function createFamixClass(cls: ClassDeclaration, file: SourceFile, isInterface = false): Famix.Class {
    var fmxClass = new Famix.Class(fmxRep);
    var clsName = cls.getName();
    fmxClass.setName(clsName);
    fmxClass.setIsInterface(isInterface);

    var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
    fmxIndexFileAnchor.setFileName(file.getFilePath());
    fmxIndexFileAnchor.setStartPos(cls.getStart());
    fmxIndexFileAnchor.setEndPos(cls.getEnd());
    fmxIndexFileAnchor.setElement(fmxClass);

    //fmxClass.setSourceAnchor(fmxIndexFileAnchor);

    //fmxRep.addElement(fmxClass);
    fmxTypes.set(clsName, fmxClass);
    return fmxClass;
}

function createFamixMethod(method: MethodDeclaration | ConstructorDeclaration, file: SourceFile
    , isSignature = false, isConstructor = false): Famix.Method {

    var fmxMethod = new Famix.Method(fmxRep);
    if (isConstructor) {
        fmxMethod.setName("constructor");
    }
    else {
        //Arezoo
        var methodName = (method as MethodDeclaration).getName();
        fmxMethod.setName(methodName);
    }

    var methodTypeName = getUsableName(method.getReturnType().getText());
    var fmxType = getFamixType(methodTypeName);
    fmxMethod.setDeclaredType(fmxType);

    var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
    fmxIndexFileAnchor.setFileName(file.getFilePath());
    fmxIndexFileAnchor.setStartPos(method.getStart());
    fmxIndexFileAnchor.setEndPos(method.getEnd());
    fmxIndexFileAnchor.setElement(fmxMethod);

    //fmxMethod.setSourceAnchor(fmxIndexFileAnchor);

    fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());

    if (method.getParameters()) {
        method.getParameters().forEach(param => {
            var fmxParam = new Famix.Parameter(fmxRep);
            var paramTypeName = getUsableName(param.getType().getText());
            fmxParam.setDeclaredType(getFamixType(paramTypeName));
            fmxParam.setName(param.getName());
            fmxMethod.addParameters(fmxParam);
        });
    }
    //Arezoo
    if (method.getVariableDeclarations()) {
        method.getVariableDeclarations().forEach(variable => {
            var fmxLocalVariable = new Famix.LocalVariable(fmxRep);
            var localVariableTypeName = getUsableName(variable.getType().getText());
            fmxLocalVariable.setDeclaredType(getFamixType(localVariableTypeName));
            fmxLocalVariable.setName(variable.getName());
            fmxMethod.addLocalVariables(fmxLocalVariable);
        });
    }
    //
    if (!isSignature) {//////////////////
        let MethodeCyclo = 1;
        method.getStatements().forEach(stmt => {
            if ([SyntaxKind.IfStatement, SyntaxKind.WhileStatement, SyntaxKind.ForStatement,
            SyntaxKind.DoStatement].includes(stmt.getKind())) {
                MethodeCyclo++;
            }
        });

        fmxMethod.setCyclomaticComplexity(MethodeCyclo);
        fmxMethod.setNumberOfStatements(method.getStatements().length);
        fmxMethod.setNumberOfParameters(method.getParameters().length);//Arezoo
    }

    return fmxMethod;
}

function createFamixAttribute(property: PropertyDeclaration, file: SourceFile): Famix.Attribute {
    var fmxAttribute = new Famix.Attribute(fmxRep);
    fmxAttribute.setName(property.getName());

    var propTypeName = property.getType().getText();
    var fmxType = getFamixType(propTypeName);
    fmxAttribute.setDeclaredType(fmxType);
    fmxAttribute.setHasClassScope(true);

    var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
    fmxIndexFileAnchor.setFileName(file.getFilePath());
    fmxIndexFileAnchor.setStartPos(property.getStart());
    fmxIndexFileAnchor.setEndPos(property.getEnd());
    fmxIndexFileAnchor.setElement(fmxAttribute);

    //fmxAttr.setSourceAnchor(fmxIndexFileAnchor);

    return fmxAttribute;
}

function createFamixFunction(fct: FunctionDeclaration, file: SourceFile): Famix.Function {
    var fmxFunct = new Famix.Function(fmxRep);
    fmxFunct.setName(fct.getName());

    var fctTypeName = getUsableName(fct.getReturnType().getText());
    var fmxType = getFamixType(fctTypeName);
    fmxFunct.setDeclaredType(fmxType);

    var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
    fmxIndexFileAnchor.setFileName(file.getFilePath());
    fmxIndexFileAnchor.setStartPos(fct.getStart());
    fmxIndexFileAnchor.setEndPos(fct.getEnd());
    fmxIndexFileAnchor.setElement(fmxFunct);

    fmxFunct.setSourceAnchor(fmxIndexFileAnchor);

    fmxFunct.setNumberOfLinesOfCode(fct.getEndLineNumber() - fct.getStartLineNumber());

    fct.getParameters().forEach(param => {
        var fmxParam = new Famix.Parameter(fmxRep);
        var paramTypeName = getUsableName(param.getType().getText());
        fmxParam.setDeclaredType(getFamixType(paramTypeName));
        fmxParam.setName(param.getName());
        fmxFunct.addParameters(fmxParam);
    });

    let MethodeCyclo = 1;
    fct.getStatements().forEach(stmt => {
        if ([SyntaxKind.IfStatement, SyntaxKind.WhileStatement, SyntaxKind.ForStatement,
        SyntaxKind.DoStatement].includes(stmt.getKind())) {
            MethodeCyclo++;
        }
    });

    fmxFunct.setCyclomaticComplexity(MethodeCyclo);
    fmxFunct.setNumberOfStatements(fct.getStatements().length);

    return fmxFunct;
}

function getUsableName(name: string): string {
    if (name.includes('<'))
        name = name.substring(0, name.indexOf('<'));
    if (name.includes('.'))
        name = name.substring(name.lastIndexOf('.') + 1);

    return name;
}

function getFamixType(typeName: string): Famix.Type {
    var fmxType: Famix.Type;

    if (!fmxTypes.has(typeName)) {
        fmxType = new Famix.Type(fmxRep);
        fmxType.setName(typeName);
        fmxTypes.set(typeName, fmxType);
    }
    else {
        fmxType = fmxTypes.get(typeName);
    }

    return fmxType;
}
