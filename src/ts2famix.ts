import {
    ArrayLiteralExpression, PropertyAccessExpression, Decorator, ReferencedSymbol, ts, Expression, ObjectLiteralExpression,
    ReferenceEntry, ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, InterfaceDeclaration
    , MethodDeclaration, ModuleDeclaration, Project, PropertyDeclaration, SourceFile, SyntaxKind, Node, Identifier, StructureKind, ConditionalExpression
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";

export class TS2Famix {
    private fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private fmxRep = new FamixRepository();
    private fmxTypes = new Map<string, Famix.Type>();
    private allClasses = new Array<ClassDeclaration>();///////
    private allInterfaces = Array<InterfaceDeclaration>();
    private FamixToTsmorph = new Map<number, any>(); // id of famix object and ts-morph object

    famixRepFromPath(paths: Array<string>) {

        try {
            console.info(`paths = ${paths}`);
            const project = new Project();
            const sourceFiles = project.addSourceFilesAtPaths(paths);
            console.info("Source files:")
            sourceFiles.forEach(file => {
                console.info(`> ${file.getBaseName()}`);

                let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
                fmxIndexFileAnchor.setFileName(file.getFilePath());
                fmxIndexFileAnchor.setStartPos(file.getStart());
                fmxIndexFileAnchor.setEndPos(file.getEnd());

                let currentModules: ModuleDeclaration[] = file.getModules();
                console.info("Module(s):")
                if (currentModules.length > 0) {
                    this.readNamespace(currentModules, file.getFilePath(), null);
                }
                this.readNamespace(file, file.getFilePath(), null);
            });
        }
        catch (error: any) {
            console.error(error.message);
            console.error(error.stack)
            process.exit(1)
        }
        return this.fmxRep;
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

                let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
                fmxIndexFileAnchor.setFileName(filePath);
                fmxIndexFileAnchor.setStartPos(namespace.getStart());
                fmxIndexFileAnchor.setEndPos(namespace.getEnd());
                fmxIndexFileAnchor.setElement(fmxNamespace);

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

        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(filePath);
        fmxIndexFileAnchor.setStartPos(cls.getStart());
        fmxIndexFileAnchor.setEndPos(cls.getEnd());
        fmxIndexFileAnchor.setElement(fmxClass);

        //fmxClass.setSourceAnchor(fmxIndexFileAnchor);

        //fmxRep.addElement(fmxClass);
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

        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(filePath);
        fmxIndexFileAnchor.setStartPos(method.getStart());
        fmxIndexFileAnchor.setEndPos(method.getEnd());
        fmxIndexFileAnchor.setElement(fmxMethod);

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

                ///
                this.FamixToTsmorph[fmxLocalVariable.id] = variable;////////?
                //
                var referenceSymbols = variable.findReferences();
                referenceSymbols.forEach(rs => {
                    rs.getReferences().forEach(reference => {
                        var currentNode = reference.getNode()//.getParentOrThrow()//.getParentOrThrow()//.getParentOrThrow() as ArrayLiteralExpression;
                        //set access////////
                        let fmxAccess = new Famix.Access(this.fmxRep);
                        fmxAccess.setAccessor(fmxMethod);
                        fmxAccess.setVariable(fmxLocalVariable);

                        let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
                        fmxIndexFileAnchor.setFileName(reference.getSourceFile().getFilePath());
                        fmxIndexFileAnchor.setStartPos(currentNode.getStart());
                        fmxIndexFileAnchor.setEndPos(currentNode.getEnd());
                        fmxIndexFileAnchor.setElement(fmxAccess);

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

    private createFamixAttribute(property: PropertyDeclaration, filePath): Famix.Attribute {
        var fmxAttribute = new Famix.Attribute(this.fmxRep);
        fmxAttribute.setName(property.getName());

        var propTypeName = property.getType().getText();
        var fmxType = this.getFamixType(propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);

        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(filePath);
        fmxIndexFileAnchor.setStartPos(property.getStart());
        fmxIndexFileAnchor.setEndPos(property.getEnd());
        fmxIndexFileAnchor.setElement(fmxAttribute);

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
