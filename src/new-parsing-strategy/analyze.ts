import ts from "ts-morph";
import { Node, Statement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration } from "ts-morph";

const declarations: VariableDeclaration[] = [];
const project = new Project();
project.addSourceFilesAtPaths("**/*.ts");

const sourceFile = project.getSourceFileOrThrow("sample.ts");

sourceFile.getVariableStatements().forEach(v => processVariableStatement(v));

sourceFile.getVariableDeclarations().forEach(v => processVariable(v));

sourceFile.getFunctions().forEach(f => processFunction(f));

sourceFile.getModules().forEach(m => {
    console.log("Modules:");
    m.getVariableStatements().forEach(v => processVariableStatement(v));
    m.getVariableDeclarations().forEach(v => processVariable(v));
    m.getFunctions().forEach(f => processFunction(f));
});

function processVariable(v: VariableDeclaration): void {
    console.log(`variable: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()}`)
}

function processFunction(f: FunctionDeclaration): void {
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
    console.log(`Variable statement: ${v.getDeclarationKind()} ${v.getDeclarationKindKeyword().getText()} ${v.getDeclarations()[0].getName()}`)
}
