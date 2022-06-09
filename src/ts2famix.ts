import {
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration
    , MethodDeclaration, MethodSignature, ModuleDeclaration, ModuleDeclarationKind, Project, PropertyDeclaration, PropertySignature, SourceFile, StructureKind, TypeParameterDeclaration, VariableDeclaration
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { getSyntaxKindName, ModuleKind, SyntaxKind } from "@ts-morph/common";
import { number, string } from "yargs";
import { Interface } from "readline";

const UNKNOWN_VALUE = '(unknown due to parsing error)';

const cyclomatic = require('./lib/ts-complex/cyclomatic-service');

export class TS2Famix {

    private readonly fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private fmxRep = new FamixRepository();
    private fmxTypes = new Map<string, Famix.Type>();
    private allClasses = new Array<ClassDeclaration>();
    private allInterfaces = Array<InterfaceDeclaration>();
    private arrayOfAccess = new Map<number, any>(); // id of famix object(variable,attribute) and ts-morph object
    private arrayOfMethodInvocations = new Map<number, any>(); // id of famix object(method) and ts-morph object

    private currentCC: any; // store cc metrics for current file

    famixRepFromPath(paths: Array<string>) {
        try {
            console.info(`paths = ${paths}`);
            const project = new Project();
            const sourceFiles = project.addSourceFilesAtPaths(paths);
            this.generateNamespaces(sourceFiles);
            this.generateAccesses();
            this.generateInvocations();
            this.generateInheritances();
        }
        catch (error: any) {
            console.error(error.message);
            console.error(error.stack)
            process.exit(1)
        }
        return this.fmxRep;
    }

    private generateInheritances() {
        this.allClasses.forEach(cls => {
            const baseClass = cls.getBaseClass();
            if (baseClass !== undefined) {
                const fmxInheritance = new Famix.Inheritance(this.fmxRep);
                const subClass = this.fmxTypes.get(cls.getName());
                const superClass = this.fmxTypes.get(baseClass.getName());
                fmxInheritance.setSubclass(subClass);
                fmxInheritance.setSuperclass(superClass);
            }

            const interfaces = cls.getImplements();
            interfaces.forEach(inter => {
                if (!inter.getType().getText().endsWith('>')) { // ignore generics
                    const fmxImplements = new Famix.Inheritance(this.fmxRep);
                    const completeName = inter.getText();
                    const fmxSuperInter = this.fmxTypes.get(completeName.substring(completeName.lastIndexOf('.') + 1));
                    const subImplements = this.fmxTypes.get(cls.getName());
                    if (fmxImplements) {
                        fmxImplements.setSuperclass(fmxSuperInter);
                        fmxImplements.setSubclass(subImplements);
                    }
                }
            });
        });
        this.allInterfaces.forEach(inter => {
            const baseInter = inter.getBaseTypes()[0];
            if (baseInter !== undefined && baseInter.getText() !== 'Object') {
                const fmxInher = new Famix.Inheritance(this.fmxRep);
                const sub = this.fmxTypes.get(inter.getName());
                const completeName = baseInter.getText();
                const fmxSuper = this.fmxTypes.get(completeName.substring(completeName.lastIndexOf('.') + 1));
                fmxInher.setSubclass(sub);
                fmxInher.setSuperclass(fmxSuper);
            }
        });
    }

    private generateInvocations() {
        console.log(`Creating invocations:`);
        this.arrayOfMethodInvocations.forEach((savedMethod, key) => {
            console.log(`  Invocation(s) to ${savedMethod.getName()}:`);
            const fmxMethod = this.fmxRep.getFamixElementById(key) as Famix.BehaviouralEntity;
            try {
                const nodes = savedMethod.findReferencesAsNodes() as Array<Identifier>;
                nodes.forEach(node => {
                    const nodeReferenceAncestor = node.getAncestors()
                        .find(a => a.getKind() == SyntaxKind.MethodDeclaration
                            || a.getKind() == SyntaxKind.Constructor
                            || a.getKind() == SyntaxKind.FunctionDeclaration
                            //|| a.getKind() == SyntaxKind.SourceFile
                        ); //////////for global variable it must work
                    if (nodeReferenceAncestor) {
                        const ancestorFullyQualifiedName = nodeReferenceAncestor.getSymbol().getFullyQualifiedName();
                        const sender = this.fmxRep.getFamixElementByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.BehaviouralEntity;
                        console.log(`   sender: ${sender.getName()}`);
                        console.log(`   receiver: ${fmxMethod.getName()}`);
                        let fmxInvovation = new Famix.Invocation(this.fmxRep);
                        fmxInvovation.setSender(sender);
                        fmxInvovation.setReceiver(fmxMethod); 

                        this.makeFamixIndexFileAnchor(node.getSourceFile().getFilePath(), node.getStart(), node.getEnd(), fmxInvovation);
                    } else {
                        console.error(`---error--- scopeDeclaration invalid for ${node.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
                    }

                });
            } catch (error) {
                console.info(`  > WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    private generateAccesses() {
        console.log(`Creating accesses:`);
        this.arrayOfAccess.forEach((value, key) => {
            console.log(`  Access(es) to ${value.getName()}:`);
            let famixStructuralElement = this.fmxRep.getFamixElementById(key) as Famix.StructuralEntity;
            try {
                let nodes = value.findReferencesAsNodes() as Array<Identifier>;
                nodes.forEach(node => {
                    console.log(`    ${node.getSymbol().getName()}`);
                    let scopeDeclaration = node.getAncestors()
                        .find(a => a.getKind() == SyntaxKind.MethodDeclaration
                            || a.getKind() == SyntaxKind.Constructor
                            || a.getKind() == SyntaxKind.FunctionDeclaration
                            //|| a.getKind() == SyntaxKind.SourceFile
                            //|| a.getKind() == SyntaxKind.ModuleDeclaration
                        ); //////////for global variable it must work






                    // let accessor = this.fmxRep.getFamixElementby(scopeDeclaration.getSourceFile().getFilePath()
                    //     , scopeDeclaration.getStart()) as Famix.BehaviouralEntity;
                    // let fmxAccess = new Famix.Access(this.fmxRep);
                    // fmxAccess.setAccessor(accessor);
                    // fmxAccess.setVariable(famixStructuralElement);
                    if (scopeDeclaration) {
                        let fullyQualifiedName = scopeDeclaration.getSymbol().getFullyQualifiedName();
                        let accessor = this.fmxRep.getFamixElementByFullyQualifiedName(fullyQualifiedName) as Famix.BehaviouralEntity;
                        console.log(`        Creating Famix.Access with accessor: ${accessor.getName()} and variable: ${famixStructuralElement.getName()}`);
                        let fmxAccess = new Famix.Access(this.fmxRep);
                        fmxAccess.setAccessor(accessor);
                        fmxAccess.setVariable(famixStructuralElement);

                        this.makeFamixIndexFileAnchor(node.getSourceFile().getFilePath(), node.getStart(), node.getEnd(), fmxAccess);
                    } else {
                        console.log(`---error--- Scope declaration is invalid for ${node.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
                    }
                });

            } catch (error) {
                console.info(`  > WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    private generateNamespaces(sourceFiles: SourceFile[]) {
        console.info("Source files:");
        sourceFiles.forEach(file => {
            console.info(`> ${file.getBaseName()}`);

            this.makeFamixIndexFileAnchor(file.getFilePath(), file.getStart(), file.getEnd(), null);

            this.currentCC = cyclomatic.calculate(file.getFilePath());

            let currentModules: ModuleDeclaration[] = file.getModules();
            console.info("Module(s):");
            if (currentModules.length > 0) {
                this.readNamespace(currentModules, file.getFilePath(), null);
            }
            this.readNamespace(file, file.getFilePath(), null);
        });
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
            let fmxClass
            const isGenerics = cls.getTypeParameters().length;
            if (isGenerics) {
                fmxClass = this.createFamixGenerics(cls, filePath);
                cls.getTypeParameters().forEach(p => {
                    fmxClass.addParameterType(this.createFamixParameterType(p));
                })
            }
            else {
                 fmxClass = this.createFamixClass(cls, filePath);
            }
            fmxNamespace.addTypes(fmxClass);

            console.info("Methods:");
            cls.getMethods().forEach(method => {
                console.info(` > ${method.getName()}`);
                const fmxMethod = this.createFamixMethod(method, filePath);
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
                try {
                    console.info(` > ${cstr.getSignature().getDeclaration().getText().split("\n")[0].trim()} ...`);                    
                } catch (error) {
                    console.info(` > WARNING: can't get signature for constructor!`);
                }
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

    private createFamixGenerics(cls: ClassDeclaration | InterfaceDeclaration, filePath, isInterface = false): Famix.Class {
        let fmxClass = new Famix.ParameterizableClass(this.fmxRep);
        let clsName = cls.getName();
        fmxClass.setName(clsName);
        fmxClass.setIsInterface(isInterface);

        this.makeFamixIndexFileAnchor(filePath, cls.getStart(), cls.getEnd(), fmxClass);

        this.fmxTypes.set(clsName, fmxClass);
        return fmxClass;
    }

    private createFamixMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature,
        filePath: string, isSignature = false, isConstructor = false): Famix.Method {
        console.log(` creating a FamixFunction:`);

        let fmxMethod = new Famix.Method(this.fmxRep);
        if (isConstructor) {
            fmxMethod.setName("constructor");
        }
        else if (isSignature) {  // interfaces
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
            this.arrayOfMethodInvocations.set(fmxMethod.id, method);
            ///
        }

        if (!isSignature) {//////////////////
            // let MethodeCyclo = 1;
            // (method as MethodDeclaration).getStatements().forEach(stmt => {
            //     if ([SyntaxKind.IfStatement, SyntaxKind.WhileStatement, SyntaxKind.ForStatement, SyntaxKind.DoStatement]
            //         .includes(stmt.getKind())) {
            //         MethodeCyclo++;
            //     }
            // });

            fmxMethod.setCyclomaticComplexity(this.currentCC[fmxMethod.getName()]);
        }


        let methodTypeName = UNKNOWN_VALUE; 
        try {
            methodTypeName = this.getUsableName(method.getReturnType().getText());            
        } catch (error) {
            console.info(`  > WARNING -- failed to get usable name for return type of method: ${fmxMethod.getName()}`);
        }
        let fmxType = this.getFamixType(methodTypeName);
        fmxMethod.setDeclaredType(fmxType);
        fmxMethod.setKind(method.getKindName());
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
        let fqn = UNKNOWN_VALUE;
        try {
            fqn = method.getSymbol().getFullyQualifiedName();
        } catch (error) {
            console.info(`  > WARNING -- failed to get fully qualified name for method: ${fmxMethod.getName()}`);
        }
        fmxMethod.setFullyQualifiedName(fqn);
        this.makeFamixIndexFileAnchor(filePath, method.getStart(), method.getEnd(), fmxMethod);

        //Parameters
        let parameters = method.getParameters();
        if (parameters.length > 0) {
            parameters.forEach(param => {
                let fmxParam = new Famix.Parameter(this.fmxRep);
                let paramTypeName = UNKNOWN_VALUE;
                try {
                    paramTypeName = this.getUsableName(param.getType().getText());
                } catch (error) {
                    console.info(`  > WARNING -- failed to get usable name for param: ${param.getName()}`);
                }
                fmxParam.setDeclaredType(this.getFamixType(paramTypeName));
                fmxParam.setName(param.getName());
                fmxMethod.addParameters(fmxParam);
                this.makeFamixIndexFileAnchor(filePath, param.getStart(), param.getEnd(), fmxParam);
                if (!isSignature) {
                    //for access
                    console.log(`  Add parameter for eventual access> ${param.getText()} with ${fmxParam.id}`);
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
                    try {
                        let fullyQualifiedLocalVarName = `${variable.getSymbol().getFullyQualifiedName()}().${variable.getSymbol().getFullyQualifiedName()}`;
                        console.info(`  > ${fullyQualifiedLocalVarName}`);                        
                    } catch (error) {
                        console.info(`  > WARNING -- failed to get fullyQualifiedName for ${variable.getName()}`);
                    }

                    let fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
                    let localVariableTypeName:string = UNKNOWN_VALUE;
                    try {
                        localVariableTypeName = this.getUsableName(variable.getType().getText());
                    } catch (error) {
                        console.info(`  > WARNING -- failed to get text of type for ${variable.getName()}`);
                    }
                    fmxLocalVariable.setDeclaredType(this.getFamixType(localVariableTypeName));
                    fmxLocalVariable.setName(variable.getName());
                    fmxMethod.addLocalVariables(fmxLocalVariable);
                    this.makeFamixIndexFileAnchor(filePath, variable.getStart(), variable.getEnd(), fmxLocalVariable);
                    //var cf = variable.getSourceFile().getSymbol().getFullyQualifiedName();
                    //for access
                    console.log(`    Add local variable for eventual access> ${variable.getText()} with ${fmxLocalVariable.id}`);
                    this.arrayOfAccess.set(fmxLocalVariable.id, variable);
                });
            }
            fmxMethod.setNumberOfStatements(method.getStatements().length);
        }
        
        return fmxMethod;
    }

    private createFamixFunction(func: FunctionDeclaration, filePath): Famix.Function {
        console.log(` creating a FamixFunction:`);
        let fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getName());

        let functionTypeName = UNKNOWN_VALUE;
        try {
            functionTypeName = this.getUsableName(func.getReturnType().getText());
        } catch (error) {
            console.info(`  > WARNING - unable to get a usable name for function return type of: ${func.getName()}`)
        }
        let fmxType = this.getFamixType(functionTypeName);
        fmxFunction.setDeclaredType(fmxType);
        fmxFunction.setNumberOfLinesOfCode(func.getEndLineNumber() - func.getStartLineNumber());

        let fullyQualifiedName = UNKNOWN_VALUE;
        try {
            fullyQualifiedName = func.getSymbol().getFullyQualifiedName();
        } catch (error) {
            console.info(`  > WARNING - unable to get a fully qualified name for function return type of: ${func.getName()}`)
        }
        fmxFunction.setFullyQualifiedName(fullyQualifiedName);

        this.makeFamixIndexFileAnchor(filePath, func.getStart(), func.getEnd(), fmxFunction);

        //Parameters
        let parameters = func.getParameters();
        if (parameters.length > 0) {
            parameters.forEach(param => {
                let fmxParam = new Famix.Parameter(this.fmxRep);
                let paramTypeName = UNKNOWN_VALUE;
                try {
                    paramTypeName = this.getUsableName(param.getType().getText());
                } catch (error) {
                    console.info(`  > WARNING - unable to get a usable name for parameter: ${param.getName()}`)
                }
                fmxParam.setDeclaredType(this.getFamixType(paramTypeName));
                fmxParam.setName(param.getName());
                fmxFunction.addParameters(fmxParam);
                this.makeFamixIndexFileAnchor(filePath, param.getStart(), param.getEnd(), fmxParam);
                //for access
                console.log(`  Add parameter for eventual access> ${param.getText()} with ${fmxParam.id}`);
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
                try {
                    let fullyQualifiedLocalVarName = `${variable.getSymbol().getFullyQualifiedName()}().${variable.getSymbol().getFullyQualifiedName()}`;
                    console.info(`  > ${fullyQualifiedLocalVarName}`);                        
                } catch (error) {
                    console.info(`  > WARNING -- failed to get fullyQualifiedName for ${variable.getName()}`);
                }

                let fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
                let localVariableTypeName:string = '(uninitialized)';
                try {
                    localVariableTypeName = this.getUsableName(variable.getType().getText());
                } catch (error) {
                    console.info(`  > WARNING -- failed to get text of type for ${variable.getName()}`);
                }
                fmxLocalVariable.setDeclaredType(this.getFamixType(localVariableTypeName));
                fmxLocalVariable.setName(variable.getName());
                fmxFunction.addLocalVariables(fmxLocalVariable);
                this.makeFamixIndexFileAnchor(filePath, variable.getStart(), variable.getEnd(), fmxLocalVariable);
                //for access
                console.log(`  Add local variable for eventual access> ${variable.getText()} with ${fmxLocalVariable.id}`);
                this.arrayOfAccess.set(fmxLocalVariable.id, variable);
            });
        }
        fmxFunction.setNumberOfStatements(func.getStatements().length);

        return fmxFunction;
    }

    private createFamixParameterType(tp: TypeParameterDeclaration) {
        const fmxParameterType = new Famix.ParameterType(this.fmxRep);
        fmxParameterType.setName(tp.getName());
        return fmxParameterType;
    }

    private createFamixAttribute(property: PropertyDeclaration | PropertySignature, filePath, isSignature = false): Famix.Attribute {

        let fmxAttribute = new Famix.Attribute(this.fmxRep);
        fmxAttribute.setName(property.getName());

        let propTypeName = UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText();
        } catch (error) {
            console.info(`   > WARNING: unable to get type text for ${property.getName()}`);
        }
        let fmxType = this.getFamixType(propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);
        // fmxAttribute.addModifiers(this.getAccessor(property));
        this.makeFamixIndexFileAnchor(filePath, property.getStart(), property.getEnd(), fmxAttribute);

        if (!isSignature) {
            //for access
            console.log(`  Add property for eventual access> ${property.getText()} with ${fmxAttribute.id}`);
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
        const keyword: string = "";
        const xx = object.hasModifier(SyntaxKind.ProtectedKeyword);
        if (object.hasModifier(SyntaxKind.PrivateKeyword))
            return "Private";
        else if (object.hasModifier(SyntaxKind.PublicKeyword))
            return "Public";
        else if (object.hasModifier(SyntaxKind.ProtectedKeyword))
            return "Protected";
    }
}
