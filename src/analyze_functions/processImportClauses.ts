import { ImportDeclaration, SourceFile, ExportedDeclarations } from "ts-morph";
import { FamixFunctions } from "../famix_functions/famix_functions";

/**
 * This class is used to build a Famix model for the import clauses
 */
export class ProcessImportClauses {

    private famixFunctions: FamixFunctions; // FamixFunctions object, it contains all the functions needed to create Famix entities

    /**
     * Initializes the ProcessImportClauses object
     * @param famixFunctions FamixFunctions object, it contains all the functions needed to create Famix entities
     */
    constructor(famixFunctions: FamixFunctions) {
        this.famixFunctions = famixFunctions;
    }

    /**
     * Builds a Famix model for the import clauses of the source files which are modules
     * @param modules An array of modules
     * @param exports An array of maps of exported declarations
     */
    public processImportClauses(modules: Array<SourceFile>, exports: Array<ReadonlyMap<string, ExportedDeclarations[]>>): void {
        console.info(`processImportClauses: Creating import clauses:`);
        modules.forEach(f => {
            f.getImportDeclarations().forEach(i => {
                let path: string;
                path = this.getModulePath(i);

                i.getNamedImports().forEach(ni => {
                    console.info(`processImportClauses: Importing (named) ${ni.getName()} from ${i.getModuleSpecifierValue()}`);
                    const importedEntityName = ni.getName();
                    let bool = false;
                    exports.forEach(e => {
                        if (e.has(importedEntityName)) {
                            bool = true;
                        }
                    });
                    this.famixFunctions.createFamixImportClause(f, i.getModuleSpecifierValue(), path, ni, bool, false);
                });

                const defaultImport = i.getDefaultImport();
                if (defaultImport !== undefined) {
                    console.info(`processImportClauses: Importing (default) ${defaultImport.getText()} from ${i.getModuleSpecifierValue()}`);
                    this.famixFunctions.createFamixImportClause(f, i.getModuleSpecifierValue(), path, defaultImport, false, true);
                }

                const namespaceImport = i.getNamespaceImport();
                if (namespaceImport !== undefined) {
                    console.info(`processImportClauses: Importing (namespace) ${namespaceImport.getText()} from ${i.getModuleSpecifierValue()}`);
                    this.famixFunctions.createFamixImportClause(f, i.getModuleSpecifierValue(), path, namespaceImport, false, false);
                }
            }); 
        });
    }

    /**
     * Gets the path of an undefined module to be imported
     * @param i An import declaration
     * @returns The path of the undefined module to be imported
     */
    private getModulePath(i: ImportDeclaration): string {
        let path: string;
        if (i.getModuleSpecifierSourceFile() === undefined) {
            if (i.getModuleSpecifierValue().substring(i.getModuleSpecifierValue().length - 3) === ".ts") {
                path = i.getModuleSpecifierValue();
            }
            else {
                path = i.getModuleSpecifierValue() + ".ts";
            }
        }
        else {
            path = i.getModuleSpecifierSourceFile().getFilePath();
        }
        return path;
    }
}
