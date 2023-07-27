// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { BehavioralEntity } from "./behavioral_entity";


export class Function extends BehavioralEntity {





  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Function", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

