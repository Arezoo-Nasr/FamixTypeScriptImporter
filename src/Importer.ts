import {
    ArrayLiteralExpression, PropertyAccessExpression, Decorator, ReferencedSymbol, ts, Expression, ObjectLiteralExpression,
    ReferenceEntry,
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, InterfaceDeclaration
    , MethodDeclaration, ModuleDeclaration, Project, PropertyDeclaration, SourceFile, SyntaxKind, Node, Identifier
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
var fmxNamespacesMap = new Map<string, Famix.Namespace>();

try {
    const sourceFiles = project.addSourceFilesAtPaths(filePaths);
    sourceFiles.forEach(file => {

        // let namespaceName: string;
        // let fmxNamespace: Famix.Namespace;
        // let interfacesInFile: InterfaceDeclaration[];
        // let classesInFile: ClassDeclaration[];

        let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(file.getFilePath());
        fmxIndexFileAnchor.setStartPos(file.getStart());
        fmxIndexFileAnchor.setEndPos(file.getEnd());

        let currentModules: ModuleDeclaration[] = file.getModules();
        if (currentModules.length > 0) {
            readNamespace(currentModules, file.getFilePath(), null);
        }
        readNamespace(file, file.getFilePath(), null);
    });

    var mse = fmxRep.getJSON();
    fs.writeFile('Model.json', mse, (err) => {
        if (err) { throw err; }
    });
}
catch (Error) {
    console.log(Error.message);
}

//Arezoo
function readNamespace(currentModules: ModuleDeclaration[] | SourceFile, filePath, parentScope: Famix.Namespace = null) {
    let namespaceName: string;
    let fmxNamespace: Famix.Namespace;
    //let interfacesInFile: InterfaceDeclaration[];
    let classesInFile: ClassDeclaration[];
    let ccc = (currentModules as ModuleDeclaration[]) !== undefined;
    let cccc = (currentModules as SourceFile).getModules !== undefined;

    if ((currentModules as SourceFile).getModules === undefined) {
        (currentModules as ModuleDeclaration[]).forEach(namespace => {

            namespaceName = namespace.getName();
            fmxNamespace = checkFamixNamespace(namespaceName, parentScope);
            classesInFile = namespace.getClasses();
            //get functions //get global var
            //interfaces = namespace.getInterfaces();

            let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
            fmxIndexFileAnchor.setFileName(filePath);
            fmxIndexFileAnchor.setStartPos(namespace.getStart());
            fmxIndexFileAnchor.setEndPos(namespace.getEnd());
            fmxIndexFileAnchor.setElement(fmxNamespace);

            if (classesInFile.length > 0) {
                setElemntsInModule(classesInFile, filePath, fmxNamespace);
            }
            if (namespace.getModules().length > 0) {
                readNamespace(namespace.getModules(), filePath, fmxNamespace);
            }
        });
    }
    else {
        namespaceName = "DefaultNamespace";
        fmxNamespace = checkFamixNamespace(namespaceName, parentScope);
        classesInFile = (currentModules as SourceFile).getClasses();
        //Arezoo  if there is not any classes but also it must be executed for global variables,functions,etc.

        if (classesInFile.length > 0) {
            setElemntsInModule(classesInFile, filePath, fmxNamespace);
        }

    }
}
//Arezoo
function setElemntsInModule(classesInFile: ClassDeclaration[], filePath, fmxNamespace: Famix.Namespace) {

    allClasses.push(...classesInFile);   //????????????????????
    //allInterfaces.push(...interfaces);
    classesInFile.forEach(cls => {
        var fmxClass = createFamixClass(cls, filePath);
        fmxNamespace.addTypes(fmxClass);

        cls.getMethods().forEach(method => {
            var fmxMethod = createFamixMethod(method, filePath);
            fmxClass.addMethods(fmxMethod);
        });

        cls.getProperties().forEach(prop => {
            var fmxAttr = createFamixAttribute(prop, filePath);
            fmxClass.addAttributes(fmxAttr);
        });

        cls.getConstructors().forEach(cstr => {
            var fmxMethod = createFamixMethod(cstr, filePath, false, true);
            fmxClass.addMethods(fmxMethod);
        });
    });

}
//Arezoo
function checkFamixNamespace(namespaceName: string, parentScope: Famix.Namespace = null): Famix.Namespace {

    let fmxNamespace: Famix.Namespace;

    if (!fmxNamespacesMap.has(namespaceName)) {
        fmxNamespace = new Famix.Namespace(fmxRep);
        fmxNamespace.setName(namespaceName);
        if (parentScope != null) {
            fmxNamespace.setParentScope(parentScope);
        }
        fmxNamespacesMap[namespaceName] = fmxNamespace;
    }
    else {
        fmxNamespace = fmxNamespacesMap[namespaceName];
    }

    return fmxNamespace;
}

function createFamixClass(cls: ClassDeclaration, filePath, isInterface = false): Famix.Class {
    var fmxClass = new Famix.Class(fmxRep);
    var clsName = cls.getName();
    fmxClass.setName(clsName);
    fmxClass.setIsInterface(isInterface);

    var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
    fmxIndexFileAnchor.setFileName(filePath);
    fmxIndexFileAnchor.setStartPos(cls.getStart());
    fmxIndexFileAnchor.setEndPos(cls.getEnd());
    fmxIndexFileAnchor.setElement(fmxClass);

    //fmxClass.setSourceAnchor(fmxIndexFileAnchor);

    //fmxRep.addElement(fmxClass);
    fmxTypes.set(clsName, fmxClass);
    return fmxClass;
}

function createFamixMethod(method: MethodDeclaration | ConstructorDeclaration, filePath
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
    fmxMethod.setKind(method.getKindName());
    var xx = method.getSignature().getDeclaration();
    if (method.getStatements().length > 0) {


        var yyy = method.getStatements()[0].getKindName();
        var yyy = method.getStatements()[0].getText();

        // var yyy1 = method.getBodyText()//.getStatements()[1].getChildren()[1].getDescendantStatements()//.getText()//.getKindName()//.getText();//(SyntaxKind.ExpressionStatement);
        // var yyy2 = method.getStatements()[1].getChildren()[1].getText()//.getKindName()//.getText();//(SyntaxKind.ExpressionStatement);
    }
    //fmxMethod.setSignature(method.getSignature());

    var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
    fmxIndexFileAnchor.setFileName(filePath);
    fmxIndexFileAnchor.setStartPos(method.getStart());
    fmxIndexFileAnchor.setEndPos(method.getEnd());
    fmxIndexFileAnchor.setElement(fmxMethod);

    //fmxMethod.setSourceAnchor(fmxIndexFileAnchor);

    fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());

    if (method.getParameters().length > 0) {
        method.getParameters().forEach(param => {
            var fmxParam = new Famix.Parameter(fmxRep);
            var paramTypeName = getUsableName(param.getType().getText());
            fmxParam.setDeclaredType(getFamixType(paramTypeName));
            fmxParam.setName(param.getName());
            fmxMethod.addParameters(fmxParam);
        });
    }
    //Arezoo
    if (method.getVariableDeclarations().length > 0) {
        method.getVariableDeclarations().forEach(variable => {
            var fmxLocalVariable = new Famix.LocalVariable(fmxRep);
            var localVariableTypeName = getUsableName(variable.getType().getText());
            fmxLocalVariable.setDeclaredType(getFamixType(localVariableTypeName));
            fmxLocalVariable.setName(variable.getName());
            fmxMethod.addLocalVariables(fmxLocalVariable);

            ///
            var referenceSymbols = variable.findReferences();

            referenceSymbols.forEach(rs => {
                rs.getReferences().forEach(r => {
                    var args = r.getNode();//.getParentOrThrow()//.getParentOrThrow().getParentOrThrow() as ArrayLiteralExpression;

                    //set access
                    let fmxAccess = new Famix.Access(fmxRep);
                    fmxAccess.setAccessor(fmxMethod);
                    fmxAccess.setVariable(fmxLocalVariable);

                    let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
                    fmxIndexFileAnchor.setFileName(filePath);
                    fmxIndexFileAnchor.setStartPos(args.getStart());
                    fmxIndexFileAnchor.setEndPos(args.getEnd());
                    fmxIndexFileAnchor.setElement(fmxAccess);

                    // r.getNode().replaceWithText('Arezoo');
                    // r.getSourceFile().save();
                    //var sdf = args.getElements().toString();
                    //var dd = args.getKindName();
                    //args.getChildren().forEach(c => console.log(c.getKindName().toString()));
                })
            })
        });
    }
    //
    // if (!isSignature) {//////////////////
    //     let MethodeCyclo = 1;
    //     method.getStatements().forEach(stmt => {
    //         if ([SyntaxKind.IfStatement, SyntaxKind.WhileStatement, SyntaxKind.ForStatement, SyntaxKind.DoStatement]
    //             .includes(stmt.getKind())) {
    //             MethodeCyclo++;
    //         }
    //     });

    //     fmxMethod.setCyclomaticComplexity(MethodeCyclo);
    // }

    fmxMethod.setNumberOfStatements(method.getStatements().length);
    fmxMethod.setNumberOfParameters(method.getParameters().length);//Arezoo
    return fmxMethod;
}

function createFamixAttribute(property: PropertyDeclaration, filePath): Famix.Attribute {
    var fmxAttribute = new Famix.Attribute(fmxRep);
    fmxAttribute.setName(property.getName());

    var propTypeName = property.getType().getText();
    var fmxType = getFamixType(propTypeName);
    fmxAttribute.setDeclaredType(fmxType);
    fmxAttribute.setHasClassScope(true);
    // fmxAttribute.addModifiers(property.getModifiers());

    var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
    fmxIndexFileAnchor.setFileName(filePath);
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
