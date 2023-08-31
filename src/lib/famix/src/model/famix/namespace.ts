import { FamixJSONExporter } from "../../famix_JSON_exporter";
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


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Namespace", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentScope", this.getParentScope());
  }
}
