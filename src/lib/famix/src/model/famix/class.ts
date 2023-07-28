import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";
import { Method } from "./method";
import { Field } from "./field";
import { Inheritance } from "./inheritance";

export class Class extends Type {

  private classIsTestCase: boolean;

  public getIsTestCase(): boolean {
    return this.classIsTestCase;
  }

  public setIsTestCase(classIsTestCase: boolean): void {
    this.classIsTestCase = classIsTestCase;
  }

  private classIsInterface: boolean;

  public getIsInterface(): boolean {
    return this.classIsInterface;
  }

  public setIsInterface(classIsInterface: boolean): void {
    this.classIsInterface = classIsInterface;
  }

  private classIsAbstract: boolean;

  public getIsAbstract(): boolean {
    return this.classIsAbstract;
  }

  public setIsAbstract(classIsAbstract: boolean): void {
    this.classIsAbstract = classIsAbstract;
  }

  private fields: Set<Field> = new Set();

  public getFields(): Set<Field> {
    return this.fields;
  }

  public addField(field: Field): void {
    if (!this.fields.has(field)) {
      this.fields.add(field);
      field.setParentEntity(this);
    }
  }

  private methods: Set<Method> = new Set();

  public getMethods(): Set<Method> {
    return this.methods;
  }

  public addMethod(method: Method): void {
    if (!this.methods.has(method)) {
      this.methods.add(method);
      method.setParentEntity(this);
    }
  }

  private superInheritances: Set<Inheritance> = new Set();

  public getSuperInheritances(): Set<Inheritance> {
    return this.superInheritances;
  }

  public addSuperInheritance(superInheritance: Inheritance): void {
    if (!this.superInheritances.has(superInheritance)) {
      this.superInheritances.add(superInheritance);
      superInheritance.setSubclass(this);
    }
  }

  private subInheritances: Set<Inheritance> = new Set();

  public getSubInheritances(): Set<Inheritance> {
    return this.subInheritances;
  }

  public addSubInheritance(subInheritance: Inheritance): void {
    if (!this.subInheritances.has(subInheritance)) {
      this.subInheritances.add(subInheritance);
      subInheritance.setSuperclass(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Class", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("isTestCase", this.getIsTestCase());
    exporter.addProperty("isInterface", this.getIsInterface());
    exporter.addProperty("isAbstract", this.getIsAbstract());
    exporter.addProperty("fields", this.getFields());
    exporter.addProperty("methods", this.getMethods());
    exporter.addProperty("superInheritances", this.getSuperInheritances());
    exporter.addProperty("subInheritances", this.getSubInheritances());  
  }
}
