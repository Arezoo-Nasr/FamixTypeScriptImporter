# FamixTypeScriptImporter

[![Node.js CI](https://github.com/fuhrmanator/FamixTypeScriptImporter/actions/workflows/node.js.yml/badge.svg)](https://github.com/fuhrmanator/FamixTypeScriptImporter/actions/workflows/node.js.yml)

Create a [FamixTypeScript](https://github.com/fuhrmanator/FamixTypeScript) model in JSON of TypeScript files. 

## Installation

```
npm install
```

```
npm install -g ts-node
```

## Usage

Instructions for using the command-line importer:

```
ts-node src/ts2famix-cli.ts --help
```

## Generate an object diagram of the JSON model

```
ts-node src/famix2puml.ts -i JSONModels/ModelName.json -o ModelName.puml
```

## Import the JSON into Moose 🫎

```st
'.\JSONModels\TypeScriptModel.json' asFileReference readStreamDo:
[ :stream | model := FamixTypeScriptModel new importFromJSONStream: stream. model install ].
```

