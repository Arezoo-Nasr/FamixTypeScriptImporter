//import ts, { ClassDeclaration, MethodDeclaration, VariableStatement } from "ts-morph";
//import { Node, Statement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration } from "ts-morph";
//import { getFQN } from "./fqn";
//import * as ts from "ts-morph";

let var_global = 4;
console.log(var_global);

function test0(): void {
    var_global = 5;
    console.log(var_global);
}

test0();

function computeTSMethodSignature(methodText: string): string {
    const endSignatureText = methodText.indexOf("{");
    return methodText.substring(0, endSignatureText).trim();
}

console.log(computeTSMethodSignature('function computeTSMethodSignature(methodText: string): string {const endSignatureText = methodText.indexOf("{");return methodText.substring(0, endSignatureText).trim();}'));

function test1() : string {
    return "ok";
}

console.log(test1());

const cyclomatic = require('./lib/ts-complex/cyclomatic-service');

function test2(): any {
    const currentCC = cyclomatic.calculate("src/new-parsing-strategy/sample.ts");
    return currentCC;
}

console.log(test2());

function aaa(): string {
    return undefined;
}

function test3(x: string) {
    console.log("ok", x);
}

test3(aaa());

//console.log(ts.SyntaxKind);
