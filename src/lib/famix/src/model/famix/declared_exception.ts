// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Method } from "./../famix/method";
import { Exception } from "./../famix/exception";

export class DeclaredException extends Exception {

  private declaredExceptionDefiningMethod: Method;

  // oneMany.Getter
  // @FameProperty(name = "definingMethod", opposite = "declaredExceptions")
  public getDefiningMethod(): Method {
    return this.declaredExceptionDefiningMethod;
  }

  // oneMany.Setter
  public setDefiningMethod(newDefiningMethod: Method) {
    this.declaredExceptionDefiningMethod = newDefiningMethod;
    newDefiningMethod.getDeclaredExceptions().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("DeclaredException", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("definingMethod", this.getDefiningMethod());

  }

}

