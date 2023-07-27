// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ScopingEntity } from "./scoping_entity";

export class ScriptEntity extends ScopingEntity {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Module", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);



  }

}

