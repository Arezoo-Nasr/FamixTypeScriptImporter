import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Class } from "./class";
import { Interface } from "./interface";
import { StructuralEntity } from "./structural_entity";

export class Field extends StructuralEntity {

  private isClassSide: boolean;

  public getIsClassSide(): boolean {
    return this.isClassSide;
  }

  public setIsClassSide(isClassSide: boolean): void {
    this.isClassSide = isClassSide;
  }

  private parentType: Class | Interface;

  public getParentEntity(): Class | Interface {
    return this.parentType;
  }

  public setParentEntity(parentType: Class | Interface): void {
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
    exporter.addProperty("isClassSide", this.getIsClassSide());
    exporter.addProperty("parentEntity", this.getParentEntity());
    exporter.addProperty("modifiers", this.getModifiers());
  }
}
