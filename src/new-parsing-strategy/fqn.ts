import * as ts from "ts-morph";

function getNameOfNode(a: ts.Node<ts.ts.Node>) {
    {
        switch (a.getKind()) {
            case ts.SyntaxKind.ClassDeclaration:
                return a.asKind(ts.SyntaxKind.ClassDeclaration)?.getName();

            case ts.SyntaxKind.MethodDeclaration:
                return a.asKind(ts.SyntaxKind.MethodDeclaration)?.getName();

            case ts.SyntaxKind.FunctionDeclaration:
                return a.asKind(ts.SyntaxKind.FunctionDeclaration)?.getName();

            case ts.SyntaxKind.VariableDeclaration:
                return a.asKind(ts.SyntaxKind.VariableDeclaration)?.getName();

            case ts.SyntaxKind.ModuleBlock:
                return a.asKind(ts.SyntaxKind.ModuleBlock)?.getParent().getName();

            case ts.SyntaxKind.SourceFile:
                return a.asKind(ts.SyntaxKind.SourceFile)?.getBaseName();
            default:
                // ancestor hasn't got a useful name
                break;
        }
    }
}

function getFQN(node: ts.Node) {
    const symbol = node.getSymbol();
    if (!symbol) {
        return undefined;
    }

    const declarations = symbol.getDeclarations();
    if (!declarations) {
        return undefined;
    }

    const sourceFile = declarations[0].getSourceFile();
    if (!sourceFile) {
        return undefined;
    }

    const sourceFilePath = sourceFile.getFilePath();
    const sourceFileDirectory = sourceFilePath.substring(0, sourceFilePath.lastIndexOf("/"));

    const qualifiedNameParts: string[] = [];

    const nodeName = getNameOfNode(node);
    if (nodeName) qualifiedNameParts.push(nodeName)

    const ancestors = node.getAncestors();
    ancestors.forEach(a => {
        const partName = getNameOfNode(a);
        if (partName) qualifiedNameParts.push(partName);
    });

    if (qualifiedNameParts.length > 0) {
        return `"${sourceFileDirectory}/${qualifiedNameParts.pop()}".${qualifiedNameParts.reverse().join(".")}`;
    } else {
        return undefined;
    }

}

const project = new ts.Project();
const sourceFile = project.createSourceFile(
    "test.ts",
    "namespace A {\
        class B {\
            m1() {\
                return;\
                function f() {const x = 1;\
                                var y = 3;}\
                }\
            }\
        }\
    }",
);

sourceFile.getVariableDeclarations().forEach(vd => {
    console.log(`vd: ${vd.getName()}`);
});

const checker = project.getTypeChecker();

const variableDeclaration = sourceFile.getModuleOrThrow("A").getClassOrThrow("B")//.getMethodOrThrow("m1").getFunctionOrThrow("f").getVariableDeclarationOrThrow("x");
//const result = getFullyQualifiedName(variableDeclaration, checker);
const result = getFQN(variableDeclaration);

console.log(result);

