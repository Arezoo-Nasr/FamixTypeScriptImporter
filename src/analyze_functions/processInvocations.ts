import { MethodDeclaration, FunctionDeclaration, Identifier, ConstructorDeclaration, GetAccessorDeclaration, SetAccessorDeclaration, FunctionExpression } from "ts-morph";
import { FamixFunctions } from "../famix_functions/famix_functions";

export class ProcessInvocations {

    private famixFunctions: FamixFunctions; // FamixFunctions object, it contains all the functions needed to create Famix entities

    /**
     * Initializes the ProcessInvocations object
     * @param famixFunctions FamixFunctions object, it contains all the functions needed to create Famix entities
     */
    constructor(famixFunctions: FamixFunctions) {
        this.famixFunctions = famixFunctions;
    }

    /**
     * Builds a Famix model for the invocations of the methods and functions of the source files
     * @param methodsAndFunctionsWithId A map of methods and functions with their id
     */
    public processInvocations(methodsAndFunctionsWithId: Map<number, MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration | FunctionExpression>): void {
        console.info(`Creating invocations:`);
        methodsAndFunctionsWithId.forEach((m, id) => {
            console.info(`Invocations to ${(m instanceof MethodDeclaration || m instanceof GetAccessorDeclaration || m instanceof SetAccessorDeclaration || m instanceof FunctionDeclaration) ? m.getName() : ((m instanceof ConstructorDeclaration) ? 'constructor' : (m.getName ? m.getName() : 'anonymous'))}`);
            try {
                const temp_nodes = m.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForInvocations(node, m, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    /**
     * Builds a Famix model for an invocation of a method or a function
     * @param n A node
     * @param m A method or a function
     * @param id The id of the method or the function
     */
    private processNodeForInvocations(n: Identifier, m: MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration | FunctionExpression, id: number): void {
        try {
            this.famixFunctions.createFamixInvocation(n, m, id);

            console.info(`node: node, (${n.getType().getText()})`);
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. ScopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing...`);
        }
    }
}
