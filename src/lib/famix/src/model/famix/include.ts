// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Association } from "./../famix/association";

export class Include extends Association {

  private includeSource: Object;

  // @FameProperty(name = "source")
  public getSource(): Object {
    return this.includeSource;
  }

  public setSource(includeSource: Object) {
    this.includeSource = includeSource;
  }

  private includeTarget: Object;

  // @FameProperty(name = "target")
  public getTarget(): Object {
    return this.includeTarget;
  }

  public setTarget(includeTarget: Object) {
    this.includeTarget = includeTarget;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.Include", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("source", this.getSource());
    exporter.addProperty("target", this.getTarget());

  }

}

