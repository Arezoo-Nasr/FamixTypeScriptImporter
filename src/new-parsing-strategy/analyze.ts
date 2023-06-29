import ts, { ClassDeclaration, MethodDeclaration, VariableStatement, Node, Statement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration, InterfaceDeclaration, ParameterDeclaration, Identifier, ConstructorDeclaration, MethodSignature, SourceFile, ModuleDeclaration } from "ts-morph";
import { getFQN } from "./fqn";
import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FamixFunctions } from "../famix-functions-v2";

const cyclomatic = require('../lib/ts-complex/cyclomatic-service');

const famixFunctions = new FamixFunctions();

const project = new Project();

export function famixRepFromPath(paths: Array<string>): FamixRepository {

    const sourceFiles = project.addSourceFilesAtPaths(paths);
    const sourceFile = sourceFiles[0];
    // const sourceFile = project.getSourceFileOrThrow(paths[0]);

    famixFunctions.makeFamixIndexFileAnchor(sourceFile, null); // -> createFile ???

    const currentCC = cyclomatic.calculate(sourceFile.getFilePath()); // -> TODO ???



    const classes = new Array<ClassDeclaration>();
    const interfaces = new Array<InterfaceDeclaration>();
    const functions = new Array<FunctionDeclaration>();
    const variables = new Array<VariableDeclaration>();
    const variableStatements = new Array<VariableStatement>();
    const methods = new Array<MethodDeclaration | ConstructorDeclaration | MethodSignature>();
    const declarations = new Array<VariableDeclaration>;
    const parameters = new Array<ParameterDeclaration>;
    const nodes = new Array<Identifier>;
    const methodsWithId = new Map<number, MethodDeclaration | ConstructorDeclaration | MethodSignature>(); // id of famix object(method) and ts-morph object
    const modules = new Array<ModuleDeclaration>;
    // const fields = new Array<>();

    // For each element scanned for at the sourceFile, it should also be scanned for at the module level.

    processModule(sourceFile, null); // -> considérer le fichier comme un namespace global ou pas ???

    // console.info(`----------Finding Classes:`)
    // sourceFile.getClasses().forEach(c => {
    //     let fmxClass: Famix.Class | Famix.ParameterizableClass;
    //     fmxClass = processClass(c);
    //     fmxGlobalNamespace.addTypes(fmxClass);
    // });
    
    // console.info(`----------Finding Interfaces:`)
    // sourceFile.getInterfaces().forEach(i => {
    //     let fmxInterface: Famix.Class | Famix.ParameterizableClass;
    //     fmxInterface = processInterface(i);
    //     fmxNamespace.addTypes(fmxInterface);
    // });

    // // console.info(`----------Finding VariableDeclarations:`)
    // // sourceFile.getVariableDeclarations().forEach(v => processVariable(v));

    // console.info(`----------Finding VariableStatements`)        
    // sourceFile.getVariableStatements().forEach(v => processVariableStatement(v));
    // // TODO fmxScope.addVariables(fmxVariable);

    // console.info(`----------Finding Functions:`)
    // sourceFile.getFunctions().forEach(f => {
    //     let fmxFunction: Famix.Function;
    //     fmxFunction = processFunction(f);
    //     fmxGlobalNamespace.addFunctions(fmxFunction);
    // });

    // console.info(`----------Finding Modules:`)
    // sourceFile.getModules().forEach(m => {
    //     console.info(`Module "${m.getName()}", fqn = '${m.getSourceFile().getBaseName()}':`)

    //     let fmxNamespace: Famix.Namespace;
    //     fmxNamespace = processModule(m, fmxGlobalNamespace);
        
    //     console.info(`----------Finding Classes in Module "${m.getName()}":`)
    //     m.getClasses().forEach(c => {
    //         let fmxClass: Famix.Class | Famix.ParameterizableClass;
    //         fmxClass = processClass(c);
    //         fmxNamespace.addTypes(fmxClass);
    //     });
        
    // console.info(`----------Finding Interfaces in Module "${m.getName()}":`)
    // m.getInterfaces().forEach(i => {
    //     let fmxInterface: Famix.Class | Famix.ParameterizableClass;
    //     fmxInterface = processInterface(i);
    //     fmxNamespace.addTypes(fmxInterface);
    // });

    //     // console.info(`----------Finding VariableDeclarations in Module "${m.getName()}":`)
    //     // m.getVariableDeclarations().forEach(v => processVariable(v));

    //     console.info(`----------Finding VariableStatements in Module "${m.getName()}":`)        
    //     m.getVariableStatements().forEach(v => processVariableStatement(v));
    //     // TODO fmxScope.addVariables(fmxVariable);

    //     console.info(`----------Finding Functions in Module "${m.getName()}":`)
    //     m.getFunctions().forEach(f => {
    //         let fmxFunction: Famix.Function;
    //         fmxFunction = processFunction(f);
    //         fmxNamespace.addFunctions(fmxFunction);
    //     });

    //     console.info(`----------Finding Modules in Module "${m.getName()}":`)
    //     m.getModules().forEach(md => processModule(md, fmxNamespace));
    // });

    console.info(`----------Finding Invocations:`)
    processInvocations()

    console.info(`\nClasses:`);
    // classes.forEach(c => console.log(c.getName()))
    classes.forEach(c => console.log(getFQN(c)));
    console.info(`\nMethods:`);
    // methods.forEach(m => console.log(`${m.getParent().asKind(SyntaxKind.ClassDeclaration).getName()}.${m.getName()}`))
    methods.forEach(m => console.log(getFQN(m)));
    console.info(`\nVariables:`);
    // variables.forEach(v => console.log(`(${v.getParent().getParent().getParent().getKindName()}).${v.getName()}`))
    variables.forEach(v => console.log(getFQN(v)));
    console.info(`\nVariable Statements:`);
    variableStatements.forEach(vs => console.log("1", vs.getDeclarationKind().toString(), "2", vs.getDeclarations()[0].getName(), "3", getFQN(vs.getDeclarations()[0])));
    // variableStatements.forEach(vs => console.log(getFQN(vs)));
    console.info(`\nFunctions:`);
    // functions.forEach(f => console.log(f.getName()));
    functions.forEach(f => console.log(getFQN(f)));

    function processModule(m: ModuleDeclaration | SourceFile, parentScope: Famix.Namespace = null): void { // -> global namespace ???
        if (m instanceof ModuleDeclaration) {
            modules.push(m);
        }

        const fmxNamespace = famixFunctions.createOrGetFamixNamespace(m, parentScope);
        
        if (m instanceof ModuleDeclaration) {
            console.log(`module declaration: ${m.getName()}, (${m.getType().getText()}`);
        }
        else {
            console.log(`module declaration: sourceFile`);
        }

        console.log(`module declaration: fqn = ${m.getSymbol()?.getFullyQualifiedName()}, ${fmxNamespace.getFullyQualifiedName()}`);

        console.info(`----------Finding Classes:`);
        m.getClasses().forEach(c => {
            const fmxClass = processClass(c);
            fmxNamespace.addTypes(fmxClass);
        });

        console.info(`----------Finding Interfaces:`);
        m.getInterfaces().forEach(i => {
            const fmxInterface = processInterface(i);
            fmxNamespace.addTypes(fmxInterface);
        });
        
        // console.info(`----------Finding VariableDeclarations:`)
        // sourceFile.getVariableDeclarations().forEach(v => processVariable(v));
    
        console.info(`----------Finding VariableStatements`);        
        m.getVariableStatements().forEach(v => processVariableStatement(v));
        // TODO fmxNamespace.addVariables(fmxVariable);
    
        console.info(`----------Finding Functions:`);
        m.getFunctions().forEach(f => {
            const fmxFunction = processFunction(f);
            fmxNamespace.addFunctions(fmxFunction);
        });

        console.info(`----------Finding Modules:`);
        m.getModules().forEach(md => {
            console.info(`Module "${md.getName()}", fqn = '${md.getSourceFile().getBaseName()}':`);
            processModule(md, fmxNamespace);
        });
    }

    function processClass(c: ClassDeclaration): Famix.Class | Famix.ParameterizableClass {
        classes.push(c);

        const fmxClass = famixFunctions.createOrGetFamixClassOrInterface(c, false, c.isAbstract());

        console.log(`class: ${c.getName()} (${c.getType().getText()}), fqn = ${c.getSymbol()?.getFullyQualifiedName()}, ${fmxClass.getFullyQualifiedName()}`)

        c.getMethods().forEach(m => {
            const fmxMethod = processMethod(m);
            fmxClass.addMethods(fmxMethod)
        });
        // c.getConstructors().forEach(con => processConstructor(con));
        // c.getMembers().forEach(mem => processMember(mem));

        return fmxClass;
    }

    function processInterface(i: InterfaceDeclaration): Famix.Class | Famix.ParameterizableClass { // -> fusionner avec processClass ???
        interfaces.push(i);

        const fmxInterface = famixFunctions.createOrGetFamixClassOrInterface(i, true, false);

        console.log(`interface: ${i.getName()} (${i.getType().getText()}), fqn = ${i.getSymbol()?.getFullyQualifiedName()}, ${fmxInterface.getFullyQualifiedName()}`)

        i.getMethods().forEach(m => {
            const fmxMethod = processMethod(m);
            fmxInterface.addMethods(fmxMethod)
        });
        // c.getConstructors().forEach(con => processConstructor(con));
        // c.getMembers().forEach(mem => processMember(mem));

        return fmxInterface;
    }


    function processVariable(v: VariableDeclaration): Famix.LocalVariable {
        variables.push(v);

        const fmxVar = famixFunctions.createFamixVariable(v); 

        console.log(`variable declaration: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()} ${v.getInitializer() ? "initializer: '" + v.getInitializer().getText() + "'" : ''} `);

        console.log(`variable declaration: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()}, ${fmxVar.getFullyQualifiedName()}`)

        return fmxVar;
    }

    function processFunction(f: FunctionDeclaration): Famix.Function { // -> invocations ???
        functions.push(f);

        const fmxFunction = famixFunctions.createFamixFunction(f);

        console.log(`function: ${f.getName()} (${f.getType().getText()}), fqn = ${f.getSymbol()?.getFullyQualifiedName()}, ${fmxFunction.getFullyQualifiedName()}`)

        f.getParameters().forEach(param => {
            const fmxParam = processParameter(param);
            fmxFunction.addParameters(fmxParam);
        });

        // f.getVariableDeclarations().forEach(variable => {
        //     let fmxVar: Famix.LocalVariable;
        //     fmxVar = processVariable(variable);
        //     fmxFunction.addLocalVariables(fmxVar);
        // });

        f.getVariableStatements().forEach(v => {
            const temp_variables = processVariableStatement(v)
            temp_variables.forEach(variable => fmxFunction.addLocalVariables(variable));
        }); // -> doublon avec getVariableDeclarations ??? (à retirer si oui)

        // let temp_variables: Array<Famix.LocalVariable>;
        // temp_variables = processStatements(f.getStatements());
        // temp_variables.forEach(variable => fmxFunction.addLocalVariables(variable)); // -> doublon avec getVariableDeclarations ??? (à retirer si oui), utile ???

        f.getFunctions().forEach(ff => {
            const fmxFunc = processFunction(ff);
            fmxFunction.addFunctions(fmxFunc);
        });
        
        return fmxFunction;
    }

    function processStatements(statements: Statement[]): Array<Famix.LocalVariable> { // -> utile ???
        const temp_variables = new Array<Famix.LocalVariable>();

        for (const statement of statements) {
            console.log(`processing statements...`);
            // the following can contain VariableDeclaration
            if (Node.isIfStatement(statement) 
                || Node.isDoStatement(statement) 
                || Node.isTryStatement(statement) 
                || Node.isCatchClause(statement) // vd appear in TryStatement
                || Node.isBlock(statement)
                || Node.isForInStatement(statement)
                || Node.isForOfStatement(statement)
                || Node.isForStatement(statement)
                || Node.isSwitchStatement(statement)
                || Node.isWhileStatement(statement)
                || Node.isVariableStatement(statement)
                /* etc.*/ ) { // To complete 
                console.log(`variables in ${statement.getKindName()}`);
                statement.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(vd => {
                    declarations.push(vd);
                    const fmxVar = processVariable(vd);
                    temp_variables.push(fmxVar);
                })
            }
        }

        return temp_variables;
    }

    function processVariableStatement(v: ts.VariableStatement): Array<Famix.LocalVariable> {
        variableStatements.push(v);

        const temp_variables = new Array<Famix.LocalVariable>();
        v.getDeclarations().forEach(variable => {
            const fmxVar = processVariable(variable);
            temp_variables.push(fmxVar);
        }); 

        console.log(`Variable statement: ${v.getDeclarationKindKeyword().getText()} '${v.getText()}' ${v.getDeclarations()[0].getName()}`)

        return temp_variables;
    }

    function processMethod(m: MethodDeclaration | ConstructorDeclaration | MethodSignature): Famix.Method {
        methods.push(m);

        let fmxMethod: Famix.Method;
        if (m instanceof MethodDeclaration) {
            fmxMethod = famixFunctions.createFamixMethod(m, currentCC, m.isAbstract(), m.isStatic());
        }
        else {
            fmxMethod = famixFunctions.createFamixMethod(m, currentCC, false, false);
        }
        famixFunctions.createOrGetFamixClassOrInterface(m.getParent() as (ClassDeclaration | InterfaceDeclaration)).addMethods(fmxMethod);

        if (m instanceof MethodDeclaration || m instanceof MethodSignature) {
            console.log(`Method declaration: ${m.getName()}`);
        }
        else {
            console.log(`Method declaration: constructor`);
        }

        console.log(`Method declaration: ${(m.getParent() as ClassDeclaration).getName()}, ${famixFunctions.createOrGetFamixClassOrInterface(m.getParent() as (ClassDeclaration | InterfaceDeclaration)).getName()}`);

        console.log(`method: (${m.getType().getText()}), fqn = ${m.getSymbol()?.getFullyQualifiedName()}, ${fmxMethod.getFullyQualifiedName()}`)

        m.getParameters().forEach(param => {
            const fmxParam = processParameter(param);
            fmxMethod.addParameters(fmxParam);
        });

        // m.getVariableDeclarations().forEach(variable => {
        //     let fmxVar: Famix.LocalVariable;
        //     fmxVar = processVariable(variable);
        //     fmxMethod.addLocalVariables(fmxVar);
        // });

        if (m instanceof MethodDeclaration || m instanceof ConstructorDeclaration) {
            m.getVariableStatements().forEach(v => {
                const temp_variables = processVariableStatement(v)
                temp_variables.forEach(variable => fmxMethod.addLocalVariables(variable));
            });

            m.getFunctions().forEach(fun => {
                const fmxFunction = processFunction(fun);
                fmxMethod.addFunctions(fmxFunction);
            });
        }

        methodsWithId.set(fmxMethod.id, m);

        return fmxMethod;
    }

    function processParameter(p: ts.ParameterDeclaration): Famix.Parameter {
        parameters.push(p);

        const fmxParam = famixFunctions.createFamixParameter(p);

        console.log(`parameter: ${p.getName()} (${p.getType().getText()}), fqn = ${p.getSymbol()?.getFullyQualifiedName()}, ${fmxParam.getFullyQualifiedName()}`)

        return fmxParam;
    }

    function processInvocations(): void {
        methodsWithId.forEach((m, id) => {
            try {
                const temp_nodes = m.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => processNode(node, m, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    function processNode(n: ts.Identifier, m: ts.MethodDeclaration | ConstructorDeclaration | MethodSignature, id: number): void {
        nodes.push(n);

        try {
            const fmxInvocation = famixFunctions.createFamixInvocation(n, m, id);

            console.log(`node: (${n.getType().getText()}), fqn = ${n.getSymbol()?.getFullyQualifiedName()}, ${fmxInvocation.getFullyQualifiedName()}`)
        } catch (error) {
            console.error(`---error--- scopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
        }
    }



    const fmxRep = famixFunctions.getFamixRepository();
    return fmxRep;
}
