// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";
import { Association } from "./../famix/association";

export class Inheritance extends Association {

  private inheritanceSuperclass: Type;

  // oneMany.Getter
  // @FameProperty(name = "superclass", opposite = "subInheritances")
  public getSuperclass(): Type {
    return this.inheritanceSuperclass;
  }

  // oneMany.Setter
  public setSuperclass(newSuperclass: Type) {
    this.inheritanceSuperclass = newSuperclass;
    newSuperclass.getSubInheritances().add(this);
  }

  private inheritanceSubclass: Type;

  // oneMany.Getter
  // @FameProperty(name = "subclass", opposite = "superInheritances")
  public getSubclass(): Type {
    return this.inheritanceSubclass;
  }

  // oneMany.Setter
  public setSubclass(newSubclass: Type) {
    this.inheritanceSubclass = newSubclass;
    newSubclass.getSuperInheritances().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Inheritance", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("superclass", this.getSuperclass());
    exporter.addProperty("subclass", this.getSubclass());

  }

}

