rm -f plantuml.jar
wget --no-verbose https://downloads.sourceforge.net/project/plantuml/plantuml.jar
npx tplant -i src/lib/famix/**/*.ts -o doc-metamodel/famix-typescript-model.puml
java -jar plantuml.jar -v -tsvg doc-metamodel/famix-typescript-model.puml
mv doc-metamodel/famix-typescript-model.svg doc-metamodel/famix-typescript-model-full.svg  
sed -i '/@startuml/a !include skins.include.puml' doc-metamodel/famix-typescript-model.puml
java -jar plantuml.jar -v -tsvg doc-metamodel/famix-typescript-model.puml
rm -rf doc-uml
mkdir doc-uml
cp doc-metamodel/*.svg doc-uml
