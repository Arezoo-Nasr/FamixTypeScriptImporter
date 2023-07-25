import {
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, Project, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, SyntaxKind
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { FamixFunctions } from "./famix-functions";
import { assert } from "console";

const UNKNOWN_VALUE = '(unknown due to parsing error)';

const cyclomatic = require('./lib/ts-complex/cyclomatic-service');

export class TS2Famix {

    private famixFunctions = new FamixFunctions();

    private readonly fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private readonly fmxTypes = new Map<string, Famix.Type>();
    private fmxRep = new FamixRepository();
    private allClasses = new Array<ClassDeclaration>();
    private allInterfaces = new Array<InterfaceDeclaration>();
    private arrayOfAccess = new Map<number, any>(); // id of famix object (variable, attribute) and ts-morph object
    private mapOfMethodsForFindingInvocations = new Map<number, MethodDeclaration | ConstructorDeclaration | MethodSignature>(); // id of famix object (method) and ts-morph object
    
    private project = new Project();

    private currentCC: any; // store cc (cyclomatic complexity) metrics for current file

    constructor() {
    }

    public famixRepFromPath(paths: Array<string>) {
        try {
            // console.info(`paths = ${paths}`);
            const sourceFiles = this.project.addSourceFilesAtPaths(paths);
            this.generateNamespaces(sourceFiles);
            // this.generateAccesses();
            // this.generateInvocations();
            // this.generateInheritances();
        }
        catch (error: any) {
            console.error(error.message);
            console.error(error.stack)
            process.exit(1)
        }
        return this.fmxRep;
    }
    
    private generateNamespaces(sourceFiles: SourceFile[]) {
        // console.info("Source files:");

        sourceFiles.forEach(file => {
            // console.info(`File > ${file.getBaseName()}`);
            this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, file, null);

            this.currentCC = cyclomatic.calculate(file.getFilePath());

            let currentModules: ModuleDeclaration[] = file.getModules();
            if (currentModules.length > 0) {
                // console.info(`Found ${currentModules.length} module declaration ${currentModules.length > 1 ? "s" : ""}:`);
                this.readNamespaces(currentModules, file);
            }
            
            this.readNamespaces(file, file); // -> else ou pas ???
        });
    }

    private readNamespaces(currentModules: ModuleDeclaration[] | SourceFile, file: SourceFile, parentScope: Famix.Namespace = null) {

        if (currentModules[0] instanceof ModuleDeclaration) {
            (currentModules as ModuleDeclaration[]).forEach(module => {
                this.fillModule(module, file, parentScope);
            });
        }
        else {
            this.fillModule(file, file, parentScope);
        }
    }

    private fillModule(module : ModuleDeclaration | SourceFile, file: SourceFile, parentScope: Famix.Namespace = null) {

        let namespaceName: string;
        let fmxNamespace: Famix.Namespace;
        let interfacesInFile: InterfaceDeclaration[];
        let classesInFile: ClassDeclaration[];
        let functionsInFile: FunctionDeclaration[];

        if (module instanceof ModuleDeclaration) {
            // console.info(`moduleDeclarationKind: ${module.getDeclarationKind()}`)
            namespaceName = module.getName();
        }
        else {
            namespaceName = "__global";
        }
        // console.info(`found namespace: ${namespaceName}`);
        // console.info(`fully qualified name: ${module.getSymbol().getFullyQualifiedName()}`);

        // console.info(`Analyzing file-level module:`)
        classesInFile = module.getClasses();
        interfacesInFile = module.getInterfaces();
        functionsInFile = module.getFunctions();
        const variablesInFile = module.getVariableDeclarations();

        if (classesInFile.length || interfacesInFile.length || functionsInFile.length || variablesInFile) {
            fmxNamespace = this.famixFunctions.createOrGetFamixNamespace(this.fmxRep, this.fmxNamespacesMap, namespaceName, parentScope);
        }

        // console.info(`namespace: ${namespaceName}`);
        // console.info(`classes: ${classesInFile.map(c => c.getName())}`);
        // console.info(`interfaces: ${interfaces.map(i => i.getName())}`);
        // if there is not any classes but also it must be executed for global variables,functions,etc.

        // if (module instanceof ModuleDeclaration) {
        this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, module, fmxNamespace); // -> seulement si moduleDeclaration ???

        if (classesInFile.length) {
            this.addClassElements(classesInFile, fmxNamespace);
        }
        if (interfacesInFile.length) {
            this.addInterfaceElements(interfacesInFile, fmxNamespace);
        }
        if (functionsInFile.length) {
            this.addFunctionElements(functionsInFile, fmxNamespace);
        }
        if (variablesInFile.length) {
            this.addVariableElements(variablesInFile, fmxNamespace);
        }

        if (module.getModules().length > 0) {
            // nested namespaces
            this.readNamespaces(module.getModules(), file, fmxNamespace);
        }
    }

    private addClassElements(classesInFile: ClassDeclaration[], fmxNamespace: Famix.Namespace) {

        this.allClasses = [...classesInFile];

        // console.info("Analyzing classes:");
        classesInFile.forEach(cls => {
            // console.info(`Class > ${cls.getName()}`);
            // console.info(`Fully qualified name: ${cls.getSymbol().getFullyQualifiedName()}`);
            let fmxClass : any;
            const isGenerics = cls.getTypeParameters().length;
            fmxClass = this.famixFunctions.createOrGetFamixClass(this.fmxRep, this.fmxTypes, cls, false, cls.isAbstract());
            if (isGenerics) {
                cls.getTypeParameters().forEach(p => {
                    fmxClass.addParameterType(this.famixFunctions.createOrGetFamixParameterType(this.fmxRep, p));
                })
            }
            fmxNamespace.addTypes(fmxClass);

            // console.info("Methods:");
            // cls.getMethods().forEach(method => {
            //     console.info(` Method> ${method.getName()}`);
            //     const fmxMethod = this.createFamixMethod(method, method.isAbstract(), method.isStatic());
            //     fmxClass.addMethods(fmxMethod);
            // });

            // console.info("Properties:");
            // cls.getProperties().forEach(prop => {
            //     console.info(` Property> ${prop.getName()}`);
            //     let fmxAttr = this.createFamixAttribute(prop);
            //     fmxClass.addAttributes(fmxAttr);
            //     if (prop.isReadonly()) fmxAttr.addModifiers("readonly");
            //     console.info(`  modifiers: ${prop.getModifiers()}`);
            //     prop.getModifiers().forEach(m => {fmxAttr.addModifiers(m.getText())});
            //     if (prop.getExclamationTokenNode()) fmxAttr.addModifiers("!");
            //     if (prop.getQuestionTokenNode()) fmxAttr.addModifiers("?");
            // });

            // console.info("Constructors:");
            // cls.getConstructors().forEach(cstr => {
            //     try {
            //         console.info(` Constructor> ${cstr.getSignature().getDeclaration().getText().split("\n")[0].trim()} ...`);                    
            //     } catch (error) {
            //         console.info(` > WARNING: can't get signature for constructor!`);
            //     }
            //     let fmxMethod = this.createFamixMethod(cstr);
            //     fmxClass.addMethods(fmxMethod);
            // });
        });
    }






















































    private generateInheritances() {
        this.allClasses.forEach(cls => {
            console.info(` checking class inheritance for ${cls.getName()}`)
            const baseClass = cls.getBaseClass();
            if (baseClass !== undefined) {
                const fmxInheritance = new Famix.Inheritance(this.fmxRep);
                const subClass = this.fmxTypes.get(cls.getName());
                const superClass = this.fmxTypes.get(baseClass.getName());
                console.info(`  extends ${superClass}`);
                fmxInheritance.setSubclass(subClass);
                fmxInheritance.setSuperclass(superClass);
            }

            console.info(` checking interface inheritance for ${cls.getName()}`)
            const interfaces = cls.getImplements();
            interfaces.forEach(inter => {
                const fmxImplements = new Famix.Inheritance(this.fmxRep);
                const completeName = inter.getText();
                const fmxSuperInter = this.fmxTypes.get(inter.getExpression().getText());
                const subImplements = this.fmxTypes.get(cls.getName());
                console.info(`  implements ${completeName} (or ${inter.getExpression().getText()})`);
                assert(fmxSuperInter);
                assert(subImplements);
                if (fmxImplements) {
                    fmxImplements.setSuperclass(fmxSuperInter);
                    fmxImplements.setSubclass(subImplements);
                } else {
                    console.error(`failed to allocate Famix.Inheritance.`)
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

        // const callExpressions = this.allProjectCallExpressions();
        // callExpressions.forEach(ce => {
        //     console.log(`  CallExpression: ${ce.getText()}`);
        //     const returnType = this.project.getTypeChecker().getTypeAtLocation(ce);
        //     console.log(`  returnType: ${returnType.getText()}`);
        //     const theDescendants = ce.getDescendants();
        //     console.log(`  theDescendants[0]: ${theDescendants[0].getText()}`);
        //     //const receiver = this.typeChecker.getType(ce.compilerNode.expression.getChildren()[0])
        // });

        this.mapOfMethodsForFindingInvocations.forEach((savedMethod, famixId) => {
            console.log(`  Invocation(s) to ${(savedMethod instanceof MethodDeclaration || savedMethod instanceof MethodSignature)?savedMethod.getName():"constructor"}:`);
            const fmxMethod = this.fmxRep.getFamixEntityById(famixId) as Famix.BehaviouralEntity;
            try {
                const nodes = savedMethod.findReferencesAsNodes() as Array<Identifier>;
                // 
                nodes.forEach(node => {
                    const nodeReferenceAncestor = node.getAncestors()
                        .find(a => a.getKind() == SyntaxKind.MethodDeclaration
                            || a.getKind() == SyntaxKind.Constructor
                            || a.getKind() == SyntaxKind.FunctionDeclaration
                            //|| a.getKind() == SyntaxKind.SourceFile
                        ); //////////for global variable it must work
                    if (nodeReferenceAncestor) {
                        const ancestorFullyQualifiedName = nodeReferenceAncestor.getSymbol().getFullyQualifiedName();
                        const sender = this.fmxRep.getFamixEntityElementByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.BehaviouralEntity;
                        //const receiverFullyQualifiedName = savedMethod.getParent().getSymbol().getFullyQualifiedName();
                        const receiverFullyQualifiedName = this.getClassNameOfMethod(savedMethod);
                        console.log(`  Receiver fully qualified name: ${receiverFullyQualifiedName}`)
                        const receiver = this.fmxRep.getFamixClass(receiverFullyQualifiedName);
                        console.log(`  Receiver: ${receiver.getName()}`)

                        const fmxInvocation = new Famix.Invocation(this.fmxRep);
                        fmxInvocation.setSender(sender);
                        fmxInvocation.setReceiver(receiver);
                        fmxInvocation.addCandidates(fmxMethod);
                        fmxInvocation.setSignature(fmxMethod.getSignature())
                        // console.log(`   sender: ${fmxInvocation.getSender().getName()}`);
                        console.log(`   receiver: ${fmxInvocation.getReceiver().getName()}`);
                        console.log(`   candidate(s): ${fmxInvocation.getCandidates().values()[0]}`);
                        console.log(`   signature: ${fmxInvocation.getSignature()}`);

                        this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, node, fmxInvocation);
                    } else {
                        console.error(`---error--- scopeDeclaration invalid for ${node.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
                    }

                });
            } catch (error) {
                console.info(`  > WARNING: got exception ${error}. Continuing...`);
            }
        });
    }
    getClassNameOfMethod(savedMethod: MethodDeclaration | ConstructorDeclaration | MethodSignature) {
        if (savedMethod instanceof MethodDeclaration) {
            const md = savedMethod as MethodDeclaration;
            return (md.getFirstAncestorByKind(SyntaxKind.ClassDeclaration) as ClassDeclaration).getName();
        }
    }

    private allProjectCallExpressions() {
        const callExpressions = new Array();
        for (const file of this.project.getSourceFiles()) {
            for (const ce of file.getDescendantsOfKind(SyntaxKind.CallExpression)) {
                callExpressions.push(ce);
            }
        }
        return callExpressions;
    }

    private generateAccesses() {
        console.log(`Creating accesses:`);
        this.arrayOfAccess.forEach((value, key) => {
            console.log(`  Access(es) to ${value.getName()}:`);
            let famixStructuralElement = this.fmxRep.getFamixEntityById(key) as Famix.StructuralEntity;
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
                        let accessor = this.fmxRep.getFamixEntityElementByFullyQualifiedName(fullyQualifiedName) as Famix.BehaviouralEntity;
                        console.log(`        Creating Famix.Access with accessor: ${accessor.getName()} and variable: ${famixStructuralElement.getName()}`);
                        let fmxAccess = new Famix.Access(this.fmxRep);
                        fmxAccess.setAccessor(accessor);
                        fmxAccess.setVariable(famixStructuralElement);

                        this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, node, fmxAccess);
                    } else {
                        console.log(`---error--- Scope declaration is invalid for ${node.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
                    }
                });

            } catch (error) {
                console.info(`  > WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    private addVariableElements(variablesInFile: VariableDeclaration[], fmxScope: Famix.Function | Famix.Namespace | Famix.Module) {
        variablesInFile.forEach(variable => {
            console.info(` Variable> ${variable.getName()}`);
            let fmxVariable = this.makeFamixLocalVariable(variable);
            console.info(`   Famix scope: ${fmxScope.getName()} (${fmxScope instanceof Famix.Function ? "function" : fmxScope instanceof Famix.Namespace ? "namespace" : "Module"})`);
        });
    }

    private addFunctionElements(functionsInFile: FunctionDeclaration[], fmxNamespace: Famix.Namespace) {
        functionsInFile.forEach(func => {
            console.info(` Function> ${func.getName()}`);
            let fmxFunction = this.createFamixFunction(func);
            fmxNamespace.addFunctions(fmxFunction);
            console.info(`   Famix namespace: ${fmxNamespace.getName()}`);
        });
    }

    private addInterfaceElements(interfacesInFile: InterfaceDeclaration[], fmxNamespace: Famix.Namespace) {

        this.allInterfaces.push(...interfacesInFile);
        console.info("Analyzing interfaces:");
        interfacesInFile.forEach(inter => {
            console.info(`Interface> ${inter.getName()}`);

            let fmxInterface;
            const isGenerics = inter.getTypeParameters().length;
            if (isGenerics) {
                fmxInterface = this.famixFunctions.createOrGetFamixClass(this.fmxRep, this.fmxTypes, inter, true);
                inter.getTypeParameters().forEach(p => {
                    fmxInterface.addParameterType(this.famixFunctions.createOrGetFamixParameterType(this.fmxRep, p));
                })
            }
            else {
                fmxInterface = this.famixFunctions.createOrGetFamixClass(this.fmxRep, this.fmxTypes, inter, true);
            }

            fmxNamespace.addTypes(fmxInterface);

            console.info("Methods:");
            inter.getMethods().forEach(method => {
                console.info(` Method> ${method.getName()}`);
                let fmxMethod = this.createFamixMethod(method);
                fmxInterface.addMethods(fmxMethod);
            });

            console.info("Properties:");
            inter.getProperties().forEach(prop => {
                console.info(` Property> ${prop.getName()}`);
                let fmxAttr = this.createFamixAttribute(prop, true);
                fmxInterface.addAttributes(fmxAttr);
            });
        });
    }

    private createFamixMethod(method: MethodDeclaration | MethodSignature | ConstructorDeclaration,
        isAbstract = false, isStatic = false): Famix.Method {
        console.log(` creating a FamixMethod:`);

        const isConstructor = method instanceof ConstructorDeclaration;
        const isSignature = method instanceof MethodSignature;
        const fmxMethod = new Famix.Method(this.fmxRep);
        fmxMethod.setIsAbstract(isAbstract);
        fmxMethod.setIsConstructor(isConstructor);
        fmxMethod.setIsClassSide(isStatic);
        fmxMethod.setIsPrivate(method instanceof MethodDeclaration? (method.getModifiers().find(x => x.getText() == 'private')) != undefined: false);
        fmxMethod.setSignature(computeTSMethodSignature(method.getText()));

        if (isConstructor) {
            fmxMethod.setName(/* (method as ConstructorDeclaration).getParent().getName() + "." + */ "constructor");
            this.mapOfMethodsForFindingInvocations.set(fmxMethod.id, method);
        }
        else if (isSignature) {  // interfaces
            let methodName = (method as MethodSignature).getName();
            fmxMethod.setName(methodName);
        }
        else {
            let methodName = (method as MethodDeclaration).getName();
            fmxMethod.setName(methodName);
            // fmxMethod.addModifiers(this.getAccessor(method));
            ////
            //for access
            this.mapOfMethodsForFindingInvocations.set(fmxMethod.id, method);
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
        console.info(`    > Fully qualified name: '${fqn}'`)
        this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, method, fmxMethod);

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
                this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, param, fmxParam);
                if (!isSignature) {
                    //for access
                    console.log(`  Add parameter for eventual access> ${param.getText()} with ${fmxParam.id}`);
                    this.arrayOfAccess.set(fmxParam.id, param);
                }
            });
        }
        fmxMethod.setNumberOfParameters(parameters.length);

        //Variables
        if (!isSignature) {
            method = method as MethodDeclaration;
            let variables = method.getVariableDeclarations();
            if (variables.length > 0) {
                console.info(`  Variables:`);

                variables.forEach(variable => {
                    try {
                        let fullyQualifiedLocalVarName = `${variable.getSymbol().getFullyQualifiedName()}()`;
                        console.info(`  FQN> ${fullyQualifiedLocalVarName}`);
                    } catch (error) {
                        console.info(`  > WARNING -- failed to get fullyQualifiedName for ${variable.getName()}`);
                    }

                    let fmxLocalVariable = this.makeFamixLocalVariable(variable);
                    fmxMethod.addLocalVariables(fmxLocalVariable);
                    this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, variable, fmxLocalVariable);
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

    private makeFamixLocalVariable(variable: VariableDeclaration) {
        const fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
        let localVariableTypeName = UNKNOWN_VALUE;
        try {
            localVariableTypeName = this.getUsableName(variable.getType().getText());
        } catch (error) {
            console.info(`  > WARNING -- failed to get text of type for ${variable.getName()}`);
        }
        fmxLocalVariable.setDeclaredType(this.getFamixType(localVariableTypeName));
        fmxLocalVariable.setName(variable.getName());
        return fmxLocalVariable;
    }

    private createFamixFunction(func: FunctionDeclaration): Famix.Function {
        let fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getSymbol().getFullyQualifiedName());
        console.log(` creating a FamixFunction: ${fmxFunction.getName()}`);

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
        console.info(`    > Fully qualified name: '${fullyQualifiedName}'`)

        this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, func, fmxFunction);

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
                this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, param, fmxParam);
                //for access
                console.log(`  Add parameter for eventual access> ${param.getText()} with ${fmxParam.id}`);
                this.arrayOfAccess.set(fmxParam.id, param);
            });
        }
        fmxFunction.setNumberOfParameters(parameters.length);

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
                this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, variable, fmxLocalVariable);
                //for access
                console.log(`  Add local variable for eventual access> ${variable.getText()} with ${fmxLocalVariable.id}`);
                this.arrayOfAccess.set(fmxLocalVariable.id, variable);
            });
        }
        fmxFunction.setNumberOfStatements(func.getStatements().length);

        return fmxFunction;
    }

    private createFamixAttribute(property: PropertyDeclaration | PropertySignature, isSignature = false): Famix.Attribute {

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
        this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, property, fmxAttribute);

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

function computeTSMethodSignature(methodText: string): string {
    const endSignatureText = methodText.indexOf("{");
    return methodText.substring(0, endSignatureText).trim();
}

