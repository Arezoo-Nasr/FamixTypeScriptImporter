// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Method } from "./../famix/method";
import { Exception } from "./../famix/exception";

export class ThrownException extends Exception {

  private thrownExceptionDefiningMethod: Method;

  // oneMany.Getter
  // @FameProperty(name = "definingMethod", opposite = "thrownExceptions")
  public getDefiningMethod(): Method {
    return this.thrownExceptionDefiningMethod;
  }

  // oneMany.Setter
  public setDefiningMethod(newDefiningMethod: Method) {
    this.thrownExceptionDefiningMethod = newDefiningMethod;
    newDefiningMethod.getThrownExceptions().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.ThrownException", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("definingMethod", this.getDefiningMethod());

  }

}

