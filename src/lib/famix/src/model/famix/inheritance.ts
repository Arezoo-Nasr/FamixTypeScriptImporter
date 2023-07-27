// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Association } from "./../famix/association";
import { Class } from "./../famix/class";

export class Inheritance extends Association {

  private inheritanceSuperclass: Class;

  // oneMany.Getter
  // @FameProperty(name = "superclass", opposite = "subInheritances")
  public getSuperclass(): Class {
    return this.inheritanceSuperclass;
  }

  // oneMany.Setter
  public setSuperclass(newSuperclass: Class) {
    this.inheritanceSuperclass = newSuperclass;
    try {
      newSuperclass.getSubInheritances().add(this);
    } catch (error) {
      if (newSuperclass) 
        console.info(` > ERROR - couldn't get subInheritances() for class ${newSuperclass.getName()}`);
      else 
        console.info(` > ERROR - couldn't get subInheritances() for class (UNDEFINED)`);
    }
  }

  private inheritanceSubclass: Class;

  // oneMany.Getter
  // @FameProperty(name = "subclass", opposite = "superInheritances")
  public getSubclass(): Class {
    return this.inheritanceSubclass;
  }

  // oneMany.Setter
  public setSubclass(newSubclass: Class) {
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

