// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Entity } from "./../famix/entity";
import { Class } from "./../famix/class";

export class Exception extends Entity {

  private exceptionExceptionClass: Class;

  // @FameProperty(name = "exceptionClass")
  public getExceptionClass(): Class {
    return this.exceptionExceptionClass;
  }

  public setExceptionClass(exceptionExceptionClass: Class) {
    this.exceptionExceptionClass = exceptionExceptionClass;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Exception", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("exceptionClass", this.getExceptionClass());

  }

}

