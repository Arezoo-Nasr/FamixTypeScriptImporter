import ts, { ClassDeclaration, MethodDeclaration, VariableStatement, Node, Statement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration, InterfaceDeclaration, ParameterDeclaration, Identifier } from "ts-morph";
import { getFQN } from "./fqn";
// import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FamixFunctions } from "../famix-functions-v2";

let famixFunctions = new FamixFunctions();

let currentCC = null; // -> To modify ???

const project = new Project();

export function famixRepFromPath(paths: Array<string>): FamixRepository {

    const sourceFiles = project.addSourceFilesAtPaths(paths);
    const sourceFile = sourceFiles[0];
    // const sourceFile = project.getSourceFileOrThrow(paths[0]);



    const classes = new Array<ClassDeclaration>();
    const functions = new Array<FunctionDeclaration>();
    const variables = new Array<VariableDeclaration>();
    const variableStatements = new Array<VariableStatement>();
    const methods = new Array<MethodDeclaration>();
    const declarations =  new Array<VariableDeclaration>;
    const parameters =  new Array<ParameterDeclaration>;
    const nodes =  new Array<Identifier>;
    // const fields = new Array<>();

    // For each element scanned for at the sourceFile, it should also be scanned for at the module level.

    console.info(`----------Finding Classes:`)
    sourceFile.getClasses().forEach(c => processClass(c));

    console.info(`----------Finding VariableDeclarations:`)
    sourceFile.getVariableDeclarations().forEach(v => processVariable(v));

    console.info(`----------Finding VariableStatements:`)
    sourceFile.getVariableStatements().forEach(v => processVariableStatement(v));

    console.info(`----------Finding Functions:`)
    sourceFile.getFunctions().forEach(f => processFunction(f));

    console.info(`----------Finding Modules:`)
    sourceFile.getModules().forEach(m => {
        console.info(`Module "${m.getName()}", fqn = '${m.getSourceFile().getBaseName()}':`)
        console.info(`----------Finding Classes in Module "${m.getName()}":`)
        m.getClasses().forEach(c => processClass(c));
        console.info(`----------Finding VariableDeclarations in Module "${m.getName()}":`)
        m.getVariableDeclarations().forEach(v => processVariable(v));
        console.info(`----------Finding VariableStatements in Module "${m.getName()}":`)
        m.getVariableStatements().forEach(v => processVariableStatement(v));
        console.info(`----------Finding Functions in Module "${m.getName()}":`)
        m.getFunctions().forEach(f => processFunction(f));
    });

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
    variableStatements.forEach(vs => console.log(vs.getDeclarationKind().toString(), vs.getDeclarations()[0].getName(), getFQN(vs.getDeclarations()[0])));
    // variableStatements.forEach(vs => console.log(getFQN(vs)));
    console.info(`\nFunctions:`);
    // functions.forEach(f => console.log(f.getName()));
    functions.forEach(f => console.log(getFQN(f)));


    function processClass(c: ClassDeclaration): void {
        classes.push(c);

        // Créer l'élément FAMIX ???
        let fmxClass: any;
        const isGenerics = c.getTypeParameters().length;
        fmxClass = famixFunctions.createOrGetFamixClassOrInterface(c, false, c.isAbstract());
        if (isGenerics) {
            c.getTypeParameters().forEach(tp => {
                fmxClass.addParameterType(famixFunctions.createOrGetFamixParameterType(tp));
            })
        }
        // fmxNamespace.addTypes(fmxClass);

        fmxClass.setFullyQualifiedName(getFQN(c)); 

        console.log(`class: ${c.getName()} (${c.getType().getText()}), fqn = ${c.getSymbol()?.getFullyQualifiedName()}, ${fmxClass.getFullyQualifiedName()}`)

        c.getMethods().forEach(m => processMethod(m));
        // c.getConstructors().forEach(con => processConstructor(con));
        // c.getMembers().forEach(mem => processMember(mem));
    }

    function processVariable(v: VariableDeclaration): any {
        variables.push(v);

        let fmxVar: any;
        fmxVar = famixFunctions.createFamixVariable(v);

        fmxVar.setFullyQualifiedName(getFQN(v)); 

        console.log(`variable declaration: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()} ${v.getInitializer() ? "initializer: '" + v.getInitializer().getText() + "'" : ''} `);

        console.log(`variable declaration: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()}, ${fmxVar.getFullyQualifiedName()}`)

        return fmxVar;
    }

    function processFunction(f: FunctionDeclaration): void {
        functions.push(f);

        let fmxFunction: any;
        fmxFunction = famixFunctions.createFamixFunction(f);

        fmxFunction.setFullyQualifiedName(getFQN(f)); 

        console.log(`function: ${f.getName()} (${f.getType().getText()}), fqn = ${f.getSymbol()?.getFullyQualifiedName()}, ${fmxFunction.getFullyQualifiedName()}`)

        f.getParameters().forEach(param => {
            let fmxParam: any;
            fmxParam = processParameter(param);
            fmxFunction.addParameters(fmxParam);
        });

        f.getVariableDeclarations().forEach(variable => {
            let fmxVar: any;
            fmxVar = processVariable(variable);
            fmxFunction.addLocalVariables(fmxVar);
        });

        // processInvocations(f, fmxFunction.id); -> valide pour les fonctions ???

        f.getVariableStatements().forEach(v => {
            let temp_variables: any;
            temp_variables = processVariableStatement(v)
            temp_variables.forEach(variable => fmxFunction.addLocalVariables(variable));
        }); // -> doublon avec getVariableDeclarations ??? (à retirer si oui)

        let temp_variables: any;
        temp_variables = processStatements(f.getStatements());
        temp_variables.forEach(variable => fmxFunction.addLocalVariables(variable)); // -> doublon avec getVariableDeclarations ??? (à retirer si oui)

        f.getFunctions().forEach(ff => processFunction(ff));
    }

    function processStatements(statements: Statement[]): any {
        const temp_variables = new Array<any>();

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
                    let fmxVar: any;
                    fmxVar = processVariable(vd);
                    temp_variables.push(fmxVar);
                })
            }
        }

        return temp_variables;
    }

    function processVariableStatement(v: ts.VariableStatement): any {
        variableStatements.push(v);

        const temp_variables = new Array<any>();
        v.getDeclarations().forEach(variable => {
            let fmxVar: any;
            fmxVar = processVariable(variable);
            temp_variables.push(fmxVar);
        }); 

        console.log(`Variable statement: ${v.getDeclarationKindKeyword().getText()} '${v.getText()}' ${v.getDeclarations()[0].getName()}`)

        return temp_variables;
    }

    function processMethod(m: ts.MethodDeclaration): void {
        methods.push(m);

        let fmxMethod: any;
        fmxMethod = famixFunctions.createFamixMethod(m, currentCC, m.isAbstract(), m.isStatic());
        famixFunctions.createOrGetFamixClassOrInterface(m.getParent() as (ClassDeclaration | InterfaceDeclaration)).addMethods(fmxMethod);

        fmxMethod.setFullyQualifiedName(getFQN(m)); 

        console.log(`Method declaration: ${m.getName()} ${(m.getParent() as ClassDeclaration).getName()}, ${famixFunctions.createOrGetFamixClassOrInterface(m.getParent() as (ClassDeclaration | InterfaceDeclaration)).getName()}`);

        console.log(`method: ${m.getName()} (${m.getType().getText()}), fqn = ${m.getSymbol()?.getFullyQualifiedName()}, ${fmxMethod.getFullyQualifiedName()}`)

        m.getParameters().forEach(param => {
            let fmxParam: any;
            fmxParam = processParameter(param);
            fmxMethod.addParameters(fmxParam);
        });

        m.getVariableDeclarations().forEach(variable => {
            let fmxVar: any;
            fmxVar = processVariable(variable);
            fmxMethod.addLocalVariables(fmxVar);
        });

        m.getFunctions().forEach(fun => processFunction(fun));

        processInvocations(m, fmxMethod.id);
    }

    function processParameter(p: ts.ParameterDeclaration): any {
        parameters.push(p);

        let fmxParam: any;
        fmxParam = famixFunctions.createFamixParameter(p);

        fmxParam.setFullyQualifiedName(getFQN(p)); 

        console.log(`parameter: ${p.getName()} (${p.getType().getText()}), fqn = ${p.getSymbol()?.getFullyQualifiedName()}, ${fmxParam.getFullyQualifiedName()}`)

        return fmxParam;
    }

    function processInvocations(m: ts.MethodDeclaration, id: number): void {
        try {
            const temp_nodes = m.findReferencesAsNodes() as Array<Identifier>; 
            temp_nodes.forEach(node => processNode(node, m, id));
        } catch (error: any) {
            console.error(`> WARNING: got exception ${error}. Continuing...`);
        }
    }

    function processNode(n: ts.Identifier, m: ts.MethodDeclaration, id: number): void {
        nodes.push(n);

        const fmxMethod = famixFunctions.getFamixElementById(id);
        const nodeReferenceAncestor = n.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration // || a.getKind() === SyntaxKind.SourceFile
        ); // for global variable it must work
        // if (nodeReferenceAncestor) {
        try {
            const ancestorFullyQualifiedName = nodeReferenceAncestor.getSymbol().getFullyQualifiedName(); // -> utiliser getFQN ???
            const sender = famixFunctions.getFamixContainerEntityElementByFullyQualifiedName(ancestorFullyQualifiedName);
            // const receiverFullyQualifiedName = savedMethod.getParent().getSymbol().getFullyQualifiedName();
            const receiverFullyQualifiedName = famixFunctions.getClassNameOfMethod(m); // -> utiliser getFQN ???
            // console.log(`  Receiver fully qualified name: ${receiverFullyQualifiedName}`)
            const receiver = famixFunctions.getFamixClass(receiverFullyQualifiedName);
            // console.log(`  Receiver: ${receiver.getName()}`)

            // TODO const receiver = nodeReferenceAncestor.getPreviousSiblingIfKind() // TODO

            let fmxInvocation: any;
            fmxInvocation = famixFunctions.createFamixInvocation(sender, receiver, fmxMethod, n);

            fmxInvocation.setFullyQualifiedName(getFQN(n)); 

            console.log(`node: (${n.getType().getText()}), fqn = ${n.getSymbol()?.getFullyQualifiedName()}, ${fmxInvocation.getFullyQualifiedName()}`)
        } catch (error: any) {
            console.error(`---error--- scopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
        }
    }



    let fmxRep = famixFunctions.getFamixRepository();
    return fmxRep;
}
