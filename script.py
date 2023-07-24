import subprocess

def execute_command(file1, file2):
    result = subprocess.run(["diff", file1, file2], capture_output=True, text=True)
    print(result.stdout)

if __name__ == "__main__":
    # rien
    #file = "inheritance.ts" #ok
    #file = "class.ts" #ok
    #file = "parameterizable_class.ts" #ok
    # setContainer
    #file = "local_variable.ts" #ok
    #file = "global_variable.ts" #ok
    #file = "namespace.ts" #ok
    # variables
    #file = "scoping_entity.ts" #ok
    #file = "module.ts" #ok
    # extends
    #file = "abstract_file.ts" #ok
    # add
    #file = "container_entity.ts" #ok
    # invocation + access
    #file = "behavioural_entity.ts" #ok (+ variables)
    #file = "invocation.ts" #ok
    #file = "access.ts" #ok
    #file = "entity.ts" #ok (+ fqn)

    file = "abstracts.test.ts"
    #file = "access.test.ts"
    #file = "entities.test.ts"
    #file = "entities_json.test.ts"
    #file = "functions.test.ts"
    #file = "generics.test.ts"
    #file = "Invocation.test.ts"
    #file = "Invocation_json.test.ts"
    #file = "metrics.test.ts"
    #file = "inheritance.test.ts"

    #file1 = "./src/lib/famix/src/model/famix/" + file
    #file2 = "./../../fuhrmanator/FamixTypeScriptImporter/src/lib/famix/src/model/famix/" + file

    file1 = "./test/" + file
    file2 = "./../../fuhrmanator/FamixTypeScriptImporter/test/" + file
    execute_command(file1, file2)
