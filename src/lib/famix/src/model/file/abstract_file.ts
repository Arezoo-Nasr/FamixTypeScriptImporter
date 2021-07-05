// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {Entity} from "./../famix/entity";

export class AbstractFile extends Entity {

  private abstractFileName: string;

  // @FameProperty(name = "name")
  public getName(): string {
    return this.abstractFileName;
  }

  public setName(abstractFileName: string) {
    this.abstractFileName = abstractFileName;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FILE.AbstractFile", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("name", this.getName());

  }

}

