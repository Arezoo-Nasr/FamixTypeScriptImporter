import {
    ClassDeclaration, ConstructorDeclaration, InterfaceDeclaration
    , MethodDeclaration, ModuleDeclaration, ModuleDeclarationKind, Project, PropertyDeclaration, SourceFile, StructureKind, VariableDeclaration
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { getSyntaxKindName, ModuleKind, SyntaxKind } from "@ts-morph/common";

export class TS2Famix {

    private readonly fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private fmxRep = new FamixRepository();
    private fmxTypes = new Map<string, Famix.Type>();
    private allClasses = new Array<ClassDeclaration>();
    //private allInterfaces = Array<InterfaceDeclaration>();
    private arrayOfAccess = new Map<number, any>(); // id of famix object and ts-morph object
    private parsedModel: Array<any>;/////////

    famixRepFromPath(paths: Array<string>) {
        try {
            console.info(`paths = ${paths}`);
            const project = new Project();
            const sourceFiles = project.addSourceFilesAtPaths(paths);
            console.info("Source files:")
            sourceFiles.forEach(file => {
                console.info(`> ${file.getBaseName()}`);

                this.makeFamixIndexFileAnchor(file.getFilePath(), file.getStart(), file.getEnd(), null);

                let currentModules: ModuleDeclaration[] = file.getModules();
                console.info("Module(s):")
                if (currentModules.length > 0) {
                    this.readNamespace(currentModules, file.getFilePath(), null);
                }
                this.readNamespace(file, file.getFilePath(), null);
            });
            //
            this.arrayOfAccess.forEach((value, key) => {
                let famixStructuralElement = this.fmxRep.getFamixElementById(key) as Famix.StructuralEntity;
                var nodes = value.findReferencesAsNodes();
                nodes.forEach(node => {
                    var scopeDeclaration = node.getAncestors()
                        .find(a => a.getKind() == SyntaxKind.MethodDeclaration
                            || a.getKind() == SyntaxKind.Constructor
                            || a.getKind() == SyntaxKind.FunctionDeclaration
                        );//////////for global variable it must work

                    let accessor = this.fmxRep.getFamixElement(scopeDeclaration.getSourceFile().getFilePath()
                        , scopeDeclaration.getStart()) as Famix.BehaviouralEntity;
                    let fmxAccess = new Famix.Access(this.fmxRep);
                    fmxAccess.setAccessor(accessor);
                    fmxAccess.setVariable(famixStructuralElement);

                    this.makeFamixIndexFileAnchor(node.getSourceFile().getFilePath(), node.getStart(), node.getEnd(), fmxAccess);
                });
            });
            //
        }
        catch (error: any) {
            console.error(error.message);
            console.error(error.stack)
            process.exit(1)
        }
        return this.fmxRep;
    }

    private makeFamixIndexFileAnchor(filePath: string, startPos: number, endPos: number, famixElement: Famix.SourcedEntity) {
        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(filePath);
        fmxIndexFileAnchor.setStartPos(startPos);
        fmxIndexFileAnchor.setEndPos(endPos);
        if (famixElement != null) {
            fmxIndexFileAnchor.setElement(famixElement);
        }
    }
    //Arezoo
    private readNamespace(currentModules: ModuleDeclaration[] | SourceFile, filePath, parentScope: Famix.Namespace = null) {
        let namespaceName: string;
        let fmxNamespace: Famix.Namespace;
        //let interfacesInFile: InterfaceDeclaration[];
        let classesInFile: ClassDeclaration[];

        if ((currentModules as SourceFile).getModules === undefined) {
            (currentModules as ModuleDeclaration[]).forEach(namespace => {

                namespaceName = namespace.getName();
                fmxNamespace = this.checkFamixNamespace(namespaceName, parentScope);
                classesInFile = namespace.getClasses();
                //get functions //get global var
                //interfaces = namespace.getInterfaces();

                console.info(`namespace: ${namespaceName}`);
                console.info(`classes: ${classesInFile.map(c => c.getName())}`);
                // console.info(`interfaces: ${interfaces.map(i => i.getName())}`);

                this.makeFamixIndexFileAnchor(filePath, namespace.getStart(), namespace.getEnd(), fmxNamespace);

                if (classesInFile.length > 0) {
                    this.setElemntsInModule(classesInFile, filePath, fmxNamespace);
                }
                if (namespace.getModules().length > 0) {
                    this.readNamespace(namespace.getModules(), filePath, fmxNamespace);
                }
            });
        }
        else {
            namespaceName = "DefaultNamespace";
            fmxNamespace = this.checkFamixNamespace(namespaceName, parentScope);
            classesInFile = (currentModules as SourceFile).getClasses();
            console.info(`namespace: ${namespaceName}`);
            console.info(`classes: ${classesInFile.map(c => c.getName())}`);
            //Arezoo  if there is not any classes but also it must be executed for global variables,functions,etc.

            if (classesInFile.length > 0) {
                this.setElemntsInModule(classesInFile, filePath, fmxNamespace);
            }

        }
    }
    //Arezoo
    private setElemntsInModule(classesInFile: ClassDeclaration[], filePath, fmxNamespace: Famix.Namespace) {

        this.allClasses.push(...classesInFile);   //????????????????????
        //allInterfaces.push(...interfaces);
        console.info("Analyzing classes:");
        classesInFile.forEach(cls => {
            console.info(`> ${cls.getName()}`);
            var fmxClass = this.createFamixClass(cls, filePath);
            fmxNamespace.addTypes(fmxClass);

            console.info("Methods:");
            cls.getMethods().forEach(method => {
                console.info(` > ${method.getName()}`);
                var fmxMethod = this.createFamixMethod(method, filePath);
                fmxClass.addMethods(fmxMethod);
            });

            console.info("Properties:");
            cls.getProperties().forEach(prop => {
                console.info(` > ${prop.getName()}`);
                var fmxAttr = this.createFamixAttribute(prop, filePath);
                fmxClass.addAttributes(fmxAttr);
            });

            console.info("Constructors:");
            cls.getConstructors().forEach(cstr => {
                console.info(` > ${cstr.getSignature()}`);
                var fmxMethod = this.createFamixMethod(cstr, filePath, false, true);
                fmxClass.addMethods(fmxMethod);
            });
        });

    }
    //Arezoo
    private checkFamixNamespace(namespaceName: string, parentScope: Famix.Namespace = null): Famix.Namespace {

        let fmxNamespace: Famix.Namespace;
        if (!this.fmxNamespacesMap.has(namespaceName)) {
            fmxNamespace = new Famix.Namespace(this.fmxRep);
            fmxNamespace.setName(namespaceName);
            if (parentScope != null) {
                fmxNamespace.setParentScope(parentScope);
            }
            this.fmxNamespacesMap[namespaceName] = fmxNamespace;
        }
        else {
            fmxNamespace = this.fmxNamespacesMap[namespaceName];
        }

        return fmxNamespace;
    }

    private createFamixClass(cls: ClassDeclaration, filePath, isInterface = false): Famix.Class {
        var fmxClass = new Famix.Class(this.fmxRep);
        var clsName = cls.getName();
        fmxClass.setName(clsName);
        fmxClass.setIsInterface(isInterface);

        this.makeFamixIndexFileAnchor(filePath, cls.getStart(), cls.getEnd(), fmxClass);

        this.fmxTypes.set(clsName, fmxClass);
        return fmxClass;
    }

    private createFamixMethod(method: MethodDeclaration | ConstructorDeclaration, filePath
        , isSignature = false, isConstructor = false): Famix.Method {

        var fmxMethod = new Famix.Method(this.fmxRep);
        if (isConstructor) {
            fmxMethod.setName("constructor");
        }
        else {
            //Arezoo
            var methodName = (method as MethodDeclaration).getName();
            fmxMethod.setName(methodName);
        }

        var methodTypeName = this.getUsableName(method.getReturnType().getText());
        var fmxType = this.getFamixType(methodTypeName);
        fmxMethod.setDeclaredType(fmxType);
        fmxMethod.setKind(method.getKindName());
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());

        this.makeFamixIndexFileAnchor(filePath, method.getStart(), method.getEnd(), fmxMethod);

        if (method.getParameters().length > 0) {
            method.getParameters().forEach(param => {
                var fmxParam = new Famix.Parameter(this.fmxRep);
                var paramTypeName = this.getUsableName(param.getType().getText());
                fmxParam.setDeclaredType(this.getFamixType(paramTypeName));
                fmxParam.setName(param.getName());
                fmxMethod.addParameters(fmxParam);
            });
        }
        //Arezoo
        if (method.getVariableDeclarations().length > 0) {
            method.getVariableDeclarations().forEach(variable => {
                var fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
                var localVariableTypeName = this.getUsableName(variable.getType().getText());
                fmxLocalVariable.setDeclaredType(this.getFamixType(localVariableTypeName));
                fmxLocalVariable.setName(variable.getName());
                fmxMethod.addLocalVariables(fmxLocalVariable);
                //for access
                this.arrayOfAccess.set(fmxLocalVariable.id, variable);
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

    private createFamixAttribute(property: PropertyDeclaration, filePath): Famix.Attribute {
        var fmxAttribute = new Famix.Attribute(this.fmxRep);
        fmxAttribute.setName(property.getName());

        var propTypeName = property.getType().getText();
        var fmxType = this.getFamixType(propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);

        this.makeFamixIndexFileAnchor(filePath, property.getStart(), property.getEnd(), fmxAttribute);

        //for access
        this.arrayOfAccess.set(fmxAttribute.id, property);

        return fmxAttribute;
    }

    private getUsableName(name: string): string {
        if (name.includes('<'))
            name = name.substring(0, name.indexOf('<'));
        if (name.includes('.'))
            name = name.substring(name.lastIndexOf('.') + 1);

        return name;
    }

    private getFamixType(typeName: string): Famix.Type {
        var fmxType: Famix.Type;
        if (!this.fmxTypes.has(typeName)) {
            fmxType = new Famix.Type(this.fmxRep);
            fmxType.setName(typeName);
            this.fmxTypes.set(typeName, fmxType);
        }
        else {
            fmxType = this.fmxTypes.get(typeName);
        }
        return fmxType;
    }
}
