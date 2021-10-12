import * as Famix from "./model/famix";
import * as File from "./model/file";
import { FamixBaseElement } from "./famix_base_element";
import { FamixJSONExporter } from "./famix_JSON_exporter";
import { FamixRepository } from "./famix_repository";

const model = { Famix, File };

export = { FamixBaseElement, FamixJSONExporter, FamixRepository, model };
