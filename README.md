# FamixTypeScriptImporter

[![Node.js CI](https://github.com/Arezoo-Nasr/FamixTypeScriptImporter/actions/workflows/node.js.yml/badge.svg)](https://github.com/Arezoo-Nasr/FamixTypeScriptImporter/actions/workflows/node.js.yml)

Create a FAMIX model in JSON of TypeScript files. The JSON model is stored in the JSONModels folder.

## Installation

```npm install```

## Usage

Instructions for using the command-line importer:

```
ts-node src/ts2famix-cli.ts --help
```

## Import the JSON into the Moose

'.\JSONModels\TypeScriptModel.json' asFileReference readStreamDo:
[ :stream | model := FamixTypeScriptModel new importFromJSONStream: stream. model install ].