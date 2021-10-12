// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { File } from "./../file/file";

export class Header extends File {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.Header", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

