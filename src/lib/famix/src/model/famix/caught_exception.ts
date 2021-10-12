// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Method } from "./../famix/method";
import { Exception } from "./../famix/exception";

export class CaughtException extends Exception {

  private caughtExceptionDefiningMethod: Method;

  // oneMany.Getter
  // @FameProperty(name = "definingMethod", opposite = "caughtExceptions")
  public getDefiningMethod(): Method {
    return this.caughtExceptionDefiningMethod;
  }

  // oneMany.Setter
  public setDefiningMethod(newDefiningMethod: Method) {
    this.caughtExceptionDefiningMethod = newDefiningMethod;
    newDefiningMethod.getCaughtExceptions().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("CaughtException", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("definingMethod", this.getDefiningMethod());

  }

}

