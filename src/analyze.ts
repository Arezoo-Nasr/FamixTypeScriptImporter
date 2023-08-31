import { Project } from "ts-morph";
import * as fs from 'fs';
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { FamixFunctions } from "./famix_functions/famix_functions";
import { ProcessFiles } from "./analyze_functions/processFiles";
import { ProcessAccesses } from "./analyze_functions/processAccesses";
import { ProcessInvocations } from "./analyze_functions/processInvocations";
import { ProcessInheritances } from "./analyze_functions/processInheritances";
import { ProcessImportClauses } from "./analyze_functions/processImportClauses";

/**
 * This class is used to build a Famix model from a TypeScript source code
 */
export class Importer {

    private project = new Project(); // The project containing the source files to analyze
    private famixFunctions = new FamixFunctions(); // FamixFunctions object, it contains all the functions needed to create Famix entities
    private processFiles = new ProcessFiles(this.famixFunctions); // ProcessFiles object, it contains all the functions needed to process the source files
    private processAccesses = new ProcessAccesses(this.famixFunctions); // ProcessAccesses object, it contains all the functions needed to process the accesses
    private processInvocations = new ProcessInvocations(this.famixFunctions); // ProcessInvocations object, it contains all the functions needed to process the invocations
    private processInheritances = new ProcessInheritances(this.famixFunctions); // ProcessInheritances object, it contains all the functions needed to process the inheritances
    private processImportClauses = new ProcessImportClauses(this.famixFunctions); // ProcessImportClauses object, it contains all the functions needed to process the import clauses

    /**
     * Main method
     * @param paths An array of paths to the source files to analyze
     * @returns The Famix repository containing the Famix model
     */
    public famixRepFromPaths(paths: Array<string>): FamixRepository {
        let famixRep: FamixRepository;

        try {
            console.info(`famixRepFromPaths: paths: ${paths}`);

            const sourceFiles = this.project.addSourceFilesAtPaths(paths);
            this.processFiles.processFiles(sourceFiles);

            const accesses = this.processFiles.getAccesses();
            const methodsAndFunctionsWithId = this.processFiles.getMethodsAndFunctionsWithId();
            const classes = this.processFiles.getClasses();
            const interfaces = this.processFiles.getInterfaces();
            const modules = this.processFiles.getModules();
            const exports = this.processFiles.getExports();

            this.processImportClauses.processImportClauses(modules, exports);
            this.processAccesses.processAccesses(accesses);
            this.processInvocations.processInvocations(methodsAndFunctionsWithId);
            this.processInheritances.processInheritances(classes, interfaces);

            famixRep = this.famixFunctions.getFamixRepository();
        }
        catch (error) {
            console.error(`> ERROR: got exception ${error}. Exiting...`);
            console.error(error.message);
            console.error(error.stack);
            process.exit(1);
        }

        return famixRep;
    }

    /**
     * Main method for tests
     * @param filename The name of the file to analyze
     * @param source A TypeScript source code
     * @returns The Famix repository containing the Famix model
     */
    public famixRepFromSource(filename: string, source: string): FamixRepository {
        const filePath = `./test_src/${filename}.ts`;

        fs.writeFileSync(filePath, source, 'utf-8');

        const famixRep = this.famixRepFromPaths([filePath]);

        return famixRep;
    }

    /**
     * Main method for a ts-morph project
     * @param project A ts-morph project
     * @returns The Famix repository containing the Famix model
     */
    public famixRepFromProject(project: Project): FamixRepository {
        const sourceFileNames = project.getSourceFiles().map(f => f.getFilePath()) as Array<string>;

        const famixRep = this.famixRepFromPaths(sourceFileNames);

        return famixRep;
    }
}
