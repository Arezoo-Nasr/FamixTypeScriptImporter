import ts, { ClassDeclaration, MethodDeclaration, VariableStatement } from "ts-morph";
import { Node, Statement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration } from "ts-morph";

const declarations: VariableDeclaration[] = [];
const project = new Project();
project.addSourceFilesAtPaths("**/*.ts");

const classes = new Array<ClassDeclaration>();
const functions = new Array<FunctionDeclaration>();
const variables = new Array<VariableDeclaration>();
const variableStatements = new Array<VariableStatement>();
const methods = new Array<MethodDeclaration>();
//const fields = new Array<>();

const sourceFile = project.getSourceFileOrThrow("sample.ts");

// For each element scanned for at the sourceFile, it should also be scanned for at the module level.

console.info(`----------Finding Classes:`)
sourceFile.getClasses().forEach(c => processClass(c));

console.info(`----------Finding VariableStatements:`)
sourceFile.getVariableStatements().forEach(v => processVariableStatement(v));

console.info(`----------Finding VariableDeclarations:`)
sourceFile.getVariableDeclarations().forEach(v => processVariable(v));

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

// console.info(`\nClasses:`);
// classes.forEach(c => console.log(c.getName()))
// console.info(`\nMethods:`);
// methods.forEach(m => console.log(`${m.getParent().asKind(SyntaxKind.ClassDeclaration).getName()}.${m.getName()}`))
// console.info(`\nVariables:`);
// variables.forEach(v => console.log(`(${v.getParent().getParent().getParent().getKindName()}).${v.getName()}`))
// console.info(`\nVariable Statements:`);
// variableStatements.forEach(vs => console.log(vs.getDeclarations()[0].getName()))
// console.info(`\nFunctions:`);
// functions.forEach(f => console.info(f.getName()))


function processClass(c: ClassDeclaration): void {
    classes.push(c);

    // Créer l'élément FAMIX ?

    console.log(`class: ${c.getName()} (${c.getType().getText()}), fqn = ${c.getSymbol()?.getFullyQualifiedName()}`)
    c.getMethods().forEach(m => processMethod(m));
    // c.getConstructors().forEach(con => processConstructor(con));
    // c.getMembers().forEach(mem => processMember(mem));
}

function processVariable(v: VariableDeclaration): void {
    variables.push(v);
    console.log(`variable declaration: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()} ${v.getInitializer() ? "initializer: '" + v.getInitializer().getText() + "'" : ''} `);
}

function processFunction(f: FunctionDeclaration): void {
    functions.push(f);
    console.log(`function: ${f.getName()}`);
    f.getVariableStatements().forEach(v => processVariableStatement(v));
    f.getVariableDeclarations().forEach(v => processVariable(v));
    processStatements(f.getStatements());
    f.getFunctions().forEach(ff => processFunction(ff));
}

function processStatements(statements: Statement[]) {
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
            /* etc.*/ ) {
            console.log(`variables in ${statement.getKindName()}`);
            statement.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(vd => {
                processVariable(vd);
                declarations.push(vd);
            })
        }

    }

}

function processVariableStatement(v: ts.VariableStatement): void {
    variableStatements.push(v);
    console.log(`Variable statement: ${v.getDeclarationKindKeyword().getText()} '${v.getText()}' ${v.getDeclarations()[0].getName()}`)
}

function processMethod(m: ts.MethodDeclaration): void {
    methods.push(m);
    console.log(`Method declaration: ${m.getName()}`);
    m.getFunctions().forEach(fun => processFunction(fun));
}

