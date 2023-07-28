import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Class } from "./class";
import { StructuralEntity } from "./structural_entity";

export class Field extends StructuralEntity {

  private hasClassScope: boolean;

  public getHasClassScope(): boolean {
    return this.hasClassScope;
  }

  public setHasClassScope(hasClassScope: boolean): void {
    this.hasClassScope = hasClassScope;
  }

  private parentType: Class;

  public getParentEntity(): Class {
    return this.parentType;
  }

  public setParentEntity(parentType: Class): void {
    this.parentType = parentType;
    parentType.addField(this);
  }

  private modifiers: Set<string> = new Set();

  public getModifiers(): Set<string> {
    return this.modifiers;
  }

  public addModifier(modifier: string): void {
    if (!this.modifiers.has(modifier)) {
      this.modifiers.add(modifier);
    }
  }

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Field", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("hasClassScope", this.getHasClassScope());
    exporter.addProperty("parentEntity", this.getParentEntity());
    exporter.addProperty("modifiers", this.getModifiers());
  }
}
