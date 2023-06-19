function computeTSMethodSignature(methodText: string): string {
    const endSignatureText = methodText.indexOf("{");
    return methodText.substring(0, endSignatureText).trim();
}

console.log(computeTSMethodSignature('function computeTSMethodSignature(methodText: string): string {const endSignatureText = methodText.indexOf("{");return methodText.substring(0, endSignatureText).trim();}'))

function test1(array: number[]) : string {
    return "ok";
}

console.log(test1([1,2,3]))

const cyclomatic = require('./lib/ts-complex/cyclomatic-service');

function test2() : any {
    const currentCC = cyclomatic.calculate("src/new-parsing-strategy/sample.ts");
    return currentCC;
}

console.log(test2())
