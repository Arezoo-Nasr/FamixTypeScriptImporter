import os
import difflib

def file_diff(directory1, directory2, filename):
    bool = False

    file1_path = os.path.join(directory1, filename)
    file2_path = os.path.join(directory2, filename)

    if os.path.isfile(file1_path) and os.path.isfile(file2_path):
        print(file1_path)
        with open(file1_path, 'r') as file1, open(file2_path, 'r') as file2:
            diff = difflib.unified_diff(file1.readlines(), file2.readlines(), lineterm='')
            for line in diff:
                bool = True
                print(line)
            print('-' * 80)
    else:
        print(f"Le fichier {filename} n'existe pas dans les deux répertoires.")

    return bool

def directory_diff(directory1, directory2):
    L = []

    files1 = os.listdir(directory1)
    files2 = os.listdir(directory2)

    common_files = set(files1) & set(files2)

    for filename in common_files:
        bool = file_diff(directory1, directory2, filename)
        if bool:
            L.append(filename)
    
    return L

directory1 = './src/lib/famix/src/model/famix/'
directory2 = '../../fuhrmanator/FamixTypeScriptImporter/src/lib/famix/src/model/famix/'

directory3 = './src/lib/famix/src/model/file/'
directory4 = '../../fuhrmanator/FamixTypeScriptImporter/src/lib/famix/src/model/file/'

directory5 = './test'
directory6 = '../../fuhrmanator/FamixTypeScriptImporter/test'

L1 = directory_diff(directory1, directory2)
L2 = directory_diff(directory3, directory4)

#print(L1, L2)

L3 = directory_diff(directory5, directory6)

print(L3)
