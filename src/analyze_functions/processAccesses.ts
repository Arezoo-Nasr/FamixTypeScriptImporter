import { Identifier, ParameterDeclaration, VariableDeclaration, PropertyDeclaration, EnumMember } from "ts-morph";
import { FamixFunctions } from "../famix_functions/famix_functions";

/**
 * This class is used to build a Famix model for the accesses
 */
export class ProcessAccesses {

    private famixFunctions: FamixFunctions; // FamixFunctions object, it contains all the functions needed to create Famix entities

    /**
     * Initializes the ProcessAccesses object
     * @param famixFunctions FamixFunctions object, it contains all the functions needed to create Famix entities
     */
    constructor(famixFunctions: FamixFunctions) {
        this.famixFunctions = famixFunctions;
    }

    /**
     * Builds a Famix model for the accesses on the parameters, variables, properties and enum members of the source files
     * @param accessMap A map of parameters, variables, properties and enum members with their id
     */
    public processAccesses(accessMap: Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration | EnumMember>): void {
        console.info(`processAccesses: Creating accesses:`);
        accessMap.forEach((v, id) => {
            console.info(`processAccesses: Accesses to ${v.getName()}`);
            try {
                const temp_nodes = v.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForAccesses(node, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    /**
     * Builds a Famix model for an access on a parameter, variable, property or enum member
     * @param n A node
     * @param id An id of a parameter, a variable, a property or an enum member
     */
    private processNodeForAccesses(n: Identifier, id: number): void {
        try {
            // sometimes node's first ancestor is a PropertyDeclaration, which is not an access
            // see https://github.com/fuhrmanator/FamixTypeScriptImporter/issues/9
            // check for a node whose first ancestor is a property declaration and bail?
            // This may be a bug in ts-morph?
            if (n.getFirstAncestorOrThrow().getKindName() === "PropertyDeclaration") {
                console.info(`processNodeForAccesses: node kind: ${n.getKindName()}, ${n.getText()}, (${n.getType().getText()})'s first ancestor is a PropertyDeclaration. Skipping...`);
                return;
            }
            this.famixFunctions.createFamixAccess(n, id);
            console.info(`processNodeForAccesses: node kind: ${n.getKindName()}, ${n.getText()}, (${n.getType().getText()})`);
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. ScopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing...`);
        }
    }
}
