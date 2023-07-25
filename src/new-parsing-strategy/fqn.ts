import * as ts from "ts-morph";

/**
 * Gets the name of a node, if it has one
 * @param a A node
 * @returns The name of the node, or an empty string if it doesn't have one
 */
function getNameOfNode(a: ts.Node<ts.ts.Node>): string {
    switch (a.getKind()) {
        case ts.SyntaxKind.SourceFile:
            return a.asKind(ts.SyntaxKind.SourceFile)?.getBaseName();

        case ts.SyntaxKind.ModuleDeclaration:
            return a.asKind(ts.SyntaxKind.ModuleDeclaration)?.getName(); 

        case ts.SyntaxKind.ClassDeclaration:
            return a.asKind(ts.SyntaxKind.ClassDeclaration)?.getName();

        case ts.SyntaxKind.InterfaceDeclaration:
            return a.asKind(ts.SyntaxKind.InterfaceDeclaration)?.getName();              

        case ts.SyntaxKind.MethodDeclaration:
            return a.asKind(ts.SyntaxKind.MethodDeclaration)?.getName();

        case ts.SyntaxKind.MethodSignature:
            return a.asKind(ts.SyntaxKind.MethodSignature)?.getName();   

        case ts.SyntaxKind.FunctionDeclaration:
            return a.asKind(ts.SyntaxKind.FunctionDeclaration)?.getName();

        case ts.SyntaxKind.VariableDeclaration:
            return a.asKind(ts.SyntaxKind.VariableDeclaration)?.getName();
        
        case ts.SyntaxKind.Parameter:
            return a.asKind(ts.SyntaxKind.Parameter)?.getName();  

        case ts.SyntaxKind.PropertyDeclaration:
            return a.asKind(ts.SyntaxKind.PropertyDeclaration)?.getName();    

        case ts.SyntaxKind.PropertySignature:
            return a.asKind(ts.SyntaxKind.PropertySignature)?.getName();    

        case ts.SyntaxKind.Constructor:
            return "constructor";    
        
        default:
            // ancestor hasn't got a useful name
            return "";
    }
}

/**
 * Gets the fully qualified name of a node
 * @param node A node
 * @returns The fully qualified name of the node, or undefined if it doesn't have one
 */
export function getFQN(node: ts.Node): string {
    if (node instanceof ts.SourceFile) {
        return `"${node.getFilePath()}"`;
    }

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
    if (nodeName) qualifiedNameParts.push(nodeName);

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
