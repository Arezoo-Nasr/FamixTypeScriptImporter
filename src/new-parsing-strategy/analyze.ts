import ts, { ClassDeclaration, VariableStatement } from "ts-morph";
import { Node, Statement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration } from "ts-morph";

const declarations: VariableDeclaration[] = [];
const project = new Project();
project.addSourceFilesAtPaths("**/*.ts");

const classes = new Array<ClassDeclaration>();
const functions = new Array<FunctionDeclaration>();
const variables = new Array<VariableDeclaration>();
const variableStatements = new Array<VariableStatement>();

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
    console.info(`Module "${m.getName()}":`)
    console.info(`----------Finding Classes in Module "${m.getName()}":`)
    m.getClasses().forEach(c => processClass(c));
    console.info(`----------Finding VariableStatements in Module "${m.getName()}":`)
    m.getVariableStatements().forEach(v => processVariableStatement(v));
    console.info(`----------Finding VariableDeclarations in Module "${m.getName()}":`)
    m.getVariableDeclarations().forEach(v => processVariable(v));
    console.info(`----------Finding Functions in Module "${m.getName()}":`)
    m.getFunctions().forEach(f => processFunction(f));
});

console.info(`\nClasses:`);
classes.forEach(c => console.log(c.getName()))
console.info(`\nVariables:`);
variables.forEach(v => console.log(v.getName()))
console.info(`\nVariable Statements:`);
variableStatements.forEach(vs => console.log(vs.getDeclarations()[0].getName()))
console.info(`\nFunctions:`);
functions.forEach(f => console.info(f.getName()))


function processClass(c: ClassDeclaration): void {
    classes.push(c);
    console.log(`class: ${c.getName()} (${c.getType().getText()}), fqn = ${c.getSymbol()?.getFullyQualifiedName()}`)
}

function processVariable(v: VariableDeclaration): void {
    variables.push(v);
    console.log(`variable: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()}`)
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
        if (Node.isIfStatement(statement) 
            || Node.isDoStatement(statement) 
            || Node.isTryStatement(statement) 
            || Node.isCatchClause(statement)
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
    console.log(`Variable statement: ${v.getDeclarationKindKeyword().getText()} ${v.getDeclarations()[0].getName()}`)
}
