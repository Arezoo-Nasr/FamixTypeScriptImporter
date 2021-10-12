// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Entity } from "./../famix/entity";

export class AbstractFile extends Entity {

  private abstractFileName: string;

  // @FameProperty(name = "name")
  public getName(): string {
    return this.abstractFileName;
  }

  public setName(abstractFileName: string) {
    this.abstractFileName = abstractFileName;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FILE.AbstractFile", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("name", this.getName());

  }

}

