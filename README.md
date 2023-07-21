# FamixTypeScriptImporter

[![Node.js CI](https://github.com/Arezoo-Nasr/FamixTypeScriptImporter/actions/workflows/node.js.yml/badge.svg)](https://github.com/Arezoo-Nasr/FamixTypeScriptImporter/actions/workflows/node.js.yml)

Create a [FamixTypeScript](https://github.com/Arezoo-Nasr/FamixTypeScript) model in JSON of TypeScript files.

## Installation

```sh
npm install
```

```sh
npm install -g ts-node
```

## Usage

Instructions for using the command-line importer:

```sh
ts-node src/ts2famix-cli.ts --help
```

### Parsing a full project

On Windows:

```sh
ts-node .\src\ts2famix-cli.ts -i ..\path\to\project\**\*.ts -o output.json
```

> this command allows to parse all TS files and ignore the HTML or CSS one (which is particulary interesting to avoid HTML files in Angular-like projects)

## Generate an object diagram of the JSON model

```sh
ts-node src/famix2puml.ts -i JSONModels/ModelName.json -o ModelName.puml
```

## Import the JSON into Moose 🫎

```st
'.\JSONModels\TypeScriptModel.json' asFileReference readStreamDo:
[ :stream | model := FamixTypeScriptModel new importFromJSONStream: stream. model install ].
```
