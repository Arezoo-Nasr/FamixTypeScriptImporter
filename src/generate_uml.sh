# Gets latest plantuml
rm -f plantuml.jar
wget --no-verbose https://downloads.sourceforge.net/project/plantuml/plantuml.jar
# Builds metamodel plantuml from TypeScript sources
npx tplant -i src/lib/famix/**/*.ts -o doc-metamodel/famix-typescript-model.puml
# Converts plantuml source to SVG image
java -jar plantuml.jar -v -tsvg doc-metamodel/famix-typescript-model.puml
mv doc-metamodel/famix-typescript-model.svg doc-metamodel/famix-typescript-model-full.svg
# Inserts include line to customize the file  
sed -i '/@startuml/a !include skins.include.puml' doc-metamodel/famix-typescript-model.puml
# Converts plantuml source to SVG image
java -jar plantuml.jar -v -tsvg doc-metamodel/famix-typescript-model.puml
# Moves artifacts
rm -rf doc-uml
mkdir doc-uml
cp doc-metamodel/*.svg doc-uml
