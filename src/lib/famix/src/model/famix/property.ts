import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Class } from "./class";
import { Interface } from "./interface";
import { StructuralEntity } from "./structural_entity";

export class Property extends StructuralEntity {

  private isClassSide: boolean;

  public getIsClassSide(): boolean {
    return this.isClassSide;
  }

  public setIsClassSide(isClassSide: boolean): void {
    this.isClassSide = isClassSide;
  }

  private parentEntity: Class | Interface;

  public getParentEntity(): Class | Interface {
    return this.parentEntity;
  }

  public setParentEntity(parentEntity: Class | Interface): void {
    this.parentEntity = parentEntity;
    parentEntity.addProperty(this);
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
    const mse: FamixJSONExporter = new FamixJSONExporter("Property", this);
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
