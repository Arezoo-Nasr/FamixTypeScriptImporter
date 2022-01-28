import {
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration
    , MethodDeclaration, MethodSignature, ModuleDeclaration, ModuleDeclarationKind, Project, PropertyDeclaration, PropertySignature, SourceFile, StructureKind, VariableDeclaration
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { getSyntaxKindName, ModuleKind, SyntaxKind } from "@ts-morph/common";
import { number, string } from "yargs";
import { Interface } from "readline";

export class TS2Famix {

    private readonly fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private fmxRep = new FamixRepository();
    private fmxTypes = new Map<string, Famix.Type>();
    private allClasses = new Array<ClassDeclaration>();
    private allInterfaces = Array<InterfaceDeclaration>();
    private arrayOfAccess = new Map<number, any>(); // id of famix object(variable,attribute) and ts-morph object
    private arrayOfInvocation = new Map<number, any>(); // id of famix object(method) and ts-morph object
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
                let nodes = value.findReferencesAsNodes() as Array<Identifier>;
                nodes.forEach(node => {
                    let scopeDeclaration = node.getAncestors()
                        .find(a => a.getKind() == SyntaxKind.MethodDeclaration
                            || a.getKind() == SyntaxKind.Constructor
                            || a.getKind() == SyntaxKind.FunctionDeclaration
                            //|| a.getKind() == SyntaxKind.SourceFile
                            //|| a.getKind() == SyntaxKind.ModuleDeclaration
                        );//////////for global variable it must work

                    // let accessor = this.fmxRep.getFamixElementby(scopeDeclaration.getSourceFile().getFilePath()
                    //     , scopeDeclaration.getStart()) as Famix.BehaviouralEntity;
                    // let fmxAccess = new Famix.Access(this.fmxRep);
                    // fmxAccess.setAccessor(accessor);
                    // fmxAccess.setVariable(famixStructuralElement);
                    if (scopeDeclaration) {
                        let fullyQualifiedName = scopeDeclaration.getSymbol().getFullyQualifiedName()
                        let accessor = this.fmxRep.getFamixElementByFullyQualifiedName(fullyQualifiedName) as Famix.BehaviouralEntity;
                        let fmxAccess = new Famix.Access(this.fmxRep);
                        fmxAccess.setAccessor(accessor);
                        fmxAccess.setVariable(famixStructuralElement);

                        this.makeFamixIndexFileAnchor(node.getSourceFile().getFilePath(), node.getStart(), node.getEnd(), fmxAccess);
                    } else {
                        console.log(`---error--- Scope declaration is invalid for ${node.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
                    }
                });
            });
            this.arrayOfInvocation.forEach((value, key) => {
                let famixBehaviouralElement = this.fmxRep.getFamixElementById(key) as Famix.BehaviouralEntity;
                let nodes = value.findReferencesAsNodes() as Array<Identifier>;
                nodes.forEach(node => {
                    let scopeDeclaration = node.getAncestors()
                        .find(a => a.getKind() == SyntaxKind.MethodDeclaration
                            || a.getKind() == SyntaxKind.Constructor
                            || a.getKind() == SyntaxKind.FunctionDeclaration
                            //|| a.getKind() == SyntaxKind.SourceFile
                        );//////////for global variable it must work
                    if (scopeDeclaration) {
                        let fullyQualifiedName = scopeDeclaration.getSymbol().getFullyQualifiedName()
                        let receiver = this.fmxRep.getFamixElementByFullyQualifiedName(fullyQualifiedName) as Famix.BehaviouralEntity;
                        let fmxInvovation = new Famix.Invocation(this.fmxRep);
                        fmxInvovation.setReceiver(receiver);
                        fmxInvovation.setSender(famixBehaviouralElement);
    
                        this.makeFamixIndexFileAnchor(node.getSourceFile().getFilePath(), node.getStart(), node.getEnd(), fmxInvovation);
                    } else {
                        console.error(`---error--- scopeDeclaration invalid for ${node.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
                    }

                });
            });
            //Inheritance
            this.allClasses.forEach(cls => {
                var baseClass = cls.getBaseClass();
                if (baseClass !== undefined) {
                    var fmxInheritance = new Famix.Inheritance(this.fmxRep);
                    var subClass = this.fmxTypes.get(cls.getName());
                    var superClass = this.fmxTypes.get(baseClass.getName());
                    fmxInheritance.setSubclass(subClass);
                    fmxInheritance.setSuperclass(superClass);
                }

                var interfaces = cls.getImplements();
                interfaces.forEach(inter => {
                    var fmxImplements = new Famix.Inheritance(this.fmxRep);
                    var completeName = inter.getText();
                    var fmxSuperInter = this.fmxTypes.get(completeName.substring(completeName.lastIndexOf('.') + 1));
                    var subImplements = this.fmxTypes.get(cls.getName());
                    fmxImplements.setSuperclass(fmxSuperInter);
                    fmxImplements.setSubclass(subImplements);
                });
            });
            this.allInterfaces.forEach(inter => {
                var baseInter = inter.getBaseTypes()[0];
                if (baseInter !== undefined && baseInter.getText() !== 'Object') {
                    var fmxInher = new Famix.Inheritance(this.fmxRep);
                    var sub = this.fmxTypes.get(inter.getName());
                    var completeName = baseInter.getText();
                    var fmxSuper = this.fmxTypes.get(completeName.substring(completeName.lastIndexOf('.') + 1));
                    fmxInher.setSubclass(sub);
                    fmxInher.setSuperclass(fmxSuper);
                }
            });
        }
        catch (error: any) {
            console.error(error.message);
            console.error(error.stack)
            process.exit(1)
        }
        return this.fmxRep;
    }

    private makeFamixIndexFileAnchor(filePath: string, startPos: number, endPos: number, famixElement: Famix.SourcedEntity) {
        let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
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
        let interfacesInFile: InterfaceDeclaration[];
        let classesInFile: ClassDeclaration[];
        let functionsInFile: FunctionDeclaration[];

        if ((currentModules as SourceFile).getModules === undefined) {
            (currentModules as ModuleDeclaration[]).forEach(namespace => {

                namespaceName = namespace.getName();
                fmxNamespace = this.checkFamixNamespace(namespaceName, parentScope);
                classesInFile = namespace.getClasses();
                //get functions //get global var
                interfacesInFile = namespace.getInterfaces();

                console.info(`namespace: ${namespaceName}`);
                console.info(`classes: ${classesInFile.map(c => c.getName())}`);
                // console.info(`interfaces: ${interfaces.map(i => i.getName())}`);

                this.makeFamixIndexFileAnchor(filePath, namespace.getStart(), namespace.getEnd(), fmxNamespace);

                if (classesInFile.length > 0) {
                    this.setClassElements(classesInFile, filePath, fmxNamespace);
                }
                if (interfacesInFile.length > 0) {
                    this.setInterfaceElements(interfacesInFile, filePath, fmxNamespace);
                }
                namespace.getFunctions().forEach(func => {
                    console.info("functions: ");
                    console.info(` > ${func.getName()}`);
                    let fmxFunction = this.createFamixFunction(func, filePath);
                    fmxNamespace.addFunctions(fmxFunction);
                });
                if (namespace.getModules().length > 0) {
                    this.readNamespace(namespace.getModules(), filePath, fmxNamespace);
                }
            });
        }
        else {
            // namespaceName = "DefaultNamespace";
            // fmxNamespace = this.checkFamixNamespace(namespaceName, parentScope);
            classesInFile = (currentModules as SourceFile).getClasses();
            interfacesInFile = (currentModules as SourceFile).getInterfaces();
            functionsInFile = (currentModules as SourceFile).getFunctions();

            if (classesInFile.length || interfacesInFile.length || functionsInFile.length) {
                namespaceName = "DefaultNamespace";
                fmxNamespace = this.checkFamixNamespace(namespaceName, parentScope);
            }
            console.info(`namespace: ${namespaceName}`);
            console.info(`classes: ${classesInFile.map(c => c.getName())}`);
            //Arezoo  if there is not any classes but also it must be executed for global variables,functions,etc.

            if (classesInFile.length > 0) {
                this.setClassElements(classesInFile, filePath, fmxNamespace);
            }
            if (interfacesInFile.length > 0) {
                this.setInterfaceElements(interfacesInFile, filePath, fmxNamespace);
            }
            (currentModules as SourceFile).getFunctions().forEach(func => {
                console.info("functions: ");
                console.info(` > ${func.getName()}`);
                let fmxFunction = this.createFamixFunction(func, filePath);
                fmxNamespace.addFunctions(fmxFunction);
            });
        }
    }
    //Arezoo
    private setClassElements(classesInFile: ClassDeclaration[], filePath, fmxNamespace: Famix.Namespace) {

        this.allClasses.push(...classesInFile);   //????????????????????
        console.info("Analyzing classes:");
        classesInFile.forEach(cls => {
            console.info(`> ${cls.getName()}`);
            let fmxClass = this.createFamixClass(cls, filePath);
            fmxNamespace.addTypes(fmxClass);

            console.info("Methods:");
            cls.getMethods().forEach(method => {
                console.info(` > ${method.getName()}`);
                let fmxMethod = this.createFamixMethod(method, filePath);
                fmxClass.addMethods(fmxMethod);
            });

            console.info("Properties:");
            cls.getProperties().forEach(prop => {
                console.info(` > ${prop.getName()}`);
                let fmxAttr = this.createFamixAttribute(prop, filePath);
                fmxClass.addAttributes(fmxAttr);
            });

            console.info("Constructors:");
            cls.getConstructors().forEach(cstr => {
                console.info(` > ${cstr.getSignature().getDeclaration().getText().split("\n")[0].trim()} ...`);
                let fmxMethod = this.createFamixMethod(cstr, filePath, false, true);
                fmxClass.addMethods(fmxMethod);
            });
        });
    }

    private setInterfaceElements(interfacesInFile: InterfaceDeclaration[], filePath, fmxNamespace: Famix.Namespace) {

        this.allInterfaces.push(...interfacesInFile);
        console.info("Analyzing interfaces:");
        interfacesInFile.forEach(inter => {
            console.info(`> ${inter.getName()}`);
            let fmxInterface = this.createFamixClass(inter, filePath, true);
            fmxNamespace.addTypes(fmxInterface);

            console.info("Methods:");
            inter.getMethods().forEach(method => {
                console.info(` > ${method.getName()}`);
                let fmxMethod = this.createFamixMethod(method, filePath, true);
                fmxInterface.addMethods(fmxMethod);
            });

            console.info("Properties:");
            inter.getProperties().forEach(prop => {
                console.info(` > ${prop.getName()}`);
                let fmxAttr = this.createFamixAttribute(prop, filePath, true);
                fmxInterface.addAttributes(fmxAttr);
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

    private createFamixClass(cls: ClassDeclaration | InterfaceDeclaration, filePath, isInterface = false): Famix.Class {
        let fmxClass = new Famix.Class(this.fmxRep);
        let clsName = cls.getName();
        fmxClass.setName(clsName);
        fmxClass.setIsInterface(isInterface);

        this.makeFamixIndexFileAnchor(filePath, cls.getStart(), cls.getEnd(), fmxClass);

        this.fmxTypes.set(clsName, fmxClass);
        return fmxClass;
    }

    private createFamixMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature, filePath
        , isSignature = false, isConstructor = false): Famix.Method {

        let fmxMethod = new Famix.Method(this.fmxRep);
        if (isConstructor) {
            fmxMethod.setName("constructor");
        }
        else if (isSignature) {
            let methodName = (method as MethodSignature).getName();
            fmxMethod.setName(methodName);
        }
        else {
            //Arezoo
            let methodName = (method as MethodDeclaration).getName();
            fmxMethod.setName(methodName);
            // fmxMethod.addModifiers(this.getAccessor(method));
            ////
            //for access
            this.arrayOfInvocation.set(fmxMethod.id, method);
            ///
        }

        let methodTypeName = this.getUsableName(method.getReturnType().getText());
        let fmxType = this.getFamixType(methodTypeName);
        fmxMethod.setDeclaredType(fmxType);
        fmxMethod.setKind(method.getKindName());
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
        fmxMethod.setFullyQualifiedName(method.getSymbol().getFullyQualifiedName());
        this.makeFamixIndexFileAnchor(filePath, method.getStart(), method.getEnd(), fmxMethod);

        //Parameters
        let parameters = method.getParameters();
        if (parameters.length > 0) {
            parameters.forEach(param => {
                let fmxParam = new Famix.Parameter(this.fmxRep);
                let paramTypeName = this.getUsableName(param.getType().getText());
                fmxParam.setDeclaredType(this.getFamixType(paramTypeName));
                fmxParam.setName(param.getName());
                fmxMethod.addParameters(fmxParam);
                this.makeFamixIndexFileAnchor(filePath, param.getStart(), param.getEnd(), fmxParam);
                if (!isSignature) {
                    //for access
                    this.arrayOfAccess.set(fmxParam.id, param);
                }
            });
        }
        fmxMethod.setNumberOfParameters(parameters.length);//Arezoo

        //Arezoo
        //Variables
        if (!isSignature) {
            method = method as MethodDeclaration;
            let variables = method.getVariableDeclarations();
            if (variables.length > 0) {
                console.info(`  Variables:`);

                variables.forEach(variable => {
                    let fullyQualifiedLocalVarName = `${method.getSymbol().getFullyQualifiedName()}().${variable.getSymbol().getFullyQualifiedName()}`;
                    console.info(`  > ${fullyQualifiedLocalVarName}`);

                    let fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
                    let localVariableTypeName = this.getUsableName(variable.getType().getText());
                    fmxLocalVariable.setDeclaredType(this.getFamixType(localVariableTypeName));
                    fmxLocalVariable.setName(variable.getName());
                    fmxMethod.addLocalVariables(fmxLocalVariable);
                    this.makeFamixIndexFileAnchor(filePath, variable.getStart(), variable.getEnd(), fmxLocalVariable);
                    //var cf = variable.getSourceFile().getSymbol().getFullyQualifiedName();
                    //for access
                    this.arrayOfAccess.set(fmxLocalVariable.id, variable);
                });
            }
            fmxMethod.setNumberOfStatements(method.getStatements().length);
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

        return fmxMethod;
    }

    private createFamixFunction(func: FunctionDeclaration, filePath): Famix.Function {

        let fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getName());

        let functionTypeName = this.getUsableName(func.getReturnType().getText());
        let fmxType = this.getFamixType(functionTypeName);
        fmxFunction.setDeclaredType(fmxType);
        fmxFunction.setNumberOfLinesOfCode(func.getEndLineNumber() - func.getStartLineNumber());
        fmxFunction.setFullyQualifiedName(func.getSymbol().getFullyQualifiedName());

        this.makeFamixIndexFileAnchor(filePath, func.getStart(), func.getEnd(), fmxFunction);

        //Parameters
        let parameters = func.getParameters();
        if (parameters.length > 0) {
            parameters.forEach(param => {
                let fmxParam = new Famix.Parameter(this.fmxRep);
                let paramTypeName = this.getUsableName(param.getType().getText());
                fmxParam.setDeclaredType(this.getFamixType(paramTypeName));
                fmxParam.setName(param.getName());
                fmxFunction.addParameters(fmxParam);
                this.makeFamixIndexFileAnchor(filePath, param.getStart(), param.getEnd(), fmxParam);
                //for access
                this.arrayOfAccess.set(fmxParam.id, param);
            });
        }
        fmxFunction.setNumberOfParameters(parameters.length);

        //Arezoo
        //Variables
        let variables = func.getVariableDeclarations();
        if (variables.length > 0) {
            console.info(`  Variables:`);

            variables.forEach(variable => {
                let fullyQualifiedLocalVarName = `${func.getSymbol().getFullyQualifiedName()}().${variable.getSymbol().getFullyQualifiedName()}`;
                console.info(`  > ${fullyQualifiedLocalVarName}`);

                let fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
                let localVariableTypeName = this.getUsableName(variable.getType().getText());
                fmxLocalVariable.setDeclaredType(this.getFamixType(localVariableTypeName));
                fmxLocalVariable.setName(variable.getName());
                fmxFunction.addLocalVariables(fmxLocalVariable);
                this.makeFamixIndexFileAnchor(filePath, variable.getStart(), variable.getEnd(), fmxLocalVariable);
                //for access
                this.arrayOfAccess.set(fmxLocalVariable.id, variable);
            });
        }
        fmxFunction.setNumberOfStatements(func.getStatements().length);

        return fmxFunction;
    }

    private createFamixAttribute(property: PropertyDeclaration | PropertySignature, filePath, isSignature = false): Famix.Attribute {

        let fmxAttribute = new Famix.Attribute(this.fmxRep);
        fmxAttribute.setName(property.getName());

        let propTypeName = property.getType().getText();
        let fmxType = this.getFamixType(propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);
        // fmxAttribute.addModifiers(this.getAccessor(property));
        this.makeFamixIndexFileAnchor(filePath, property.getStart(), property.getEnd(), fmxAttribute);

        if (!isSignature) {
            //for access
            this.arrayOfAccess.set(fmxAttribute.id, property);
        }
        return fmxAttribute;
    }

    private getUsableName(name: string): string {
        console.log(`getUsableName: ${name}`);
        if (name.includes('<')) {
            name = name.substring(0, name.indexOf('<'));
            console.log(` changed to: ${name}`);
        }
        if (name.includes('.')) {
            name = name.substring(name.lastIndexOf('.') + 1);
            console.log(` changed to: ${name}`);
        }

        return name;
    }

    private getFamixType(typeName: string): Famix.Type {
        let fmxType: Famix.Type;
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

    private getAccessor(object: any): string {
        var keyword: string = "";
        var xx = object.hasModifier(SyntaxKind.ProtectedKeyword);
        if (object.hasModifier(SyntaxKind.PrivateKeyword))
            return "Private";
        else if (object.hasModifier(SyntaxKind.PublicKeyword))
            return "Public";
        else if (object.hasModifier(SyntaxKind.ProtectedKeyword))
            return "Protected";
    }
}
