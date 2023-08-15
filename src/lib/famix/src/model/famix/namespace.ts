import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { ScopingEntity } from "./scoping_entity";

export class Namespace extends ScopingEntity {

  private parentScope: ScopingEntity;

  public getParentScope(): ScopingEntity {
    return this.parentScope;
  }

  public setParentScope(parentScope: ScopingEntity): void {
    this.parentScope = parentScope;
    parentScope.addNamespace(this);
  }

  private numberOfAttributes: number;

  public getNumberOfAttributes(): number {
    return this.numberOfAttributes;
  }

  public setNumberOfAttributes(numberOfAttributes: number): void {
    this.numberOfAttributes = numberOfAttributes;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Namespace", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentScope", this.getParentScope());
    exporter.addProperty("numberOfAttributes", this.getNumberOfAttributes());
  }
}
