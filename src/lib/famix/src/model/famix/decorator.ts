import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { NamedEntity } from "./named_entity";

export class Decorator extends NamedEntity {

  private decoratedEntity: NamedEntity;
  
  public getDecoratedEntity(): NamedEntity {
    return this.decoratedEntity;
  }

  public setDecoratedEntity(decoratedEntity: NamedEntity): void {
    this.decoratedEntity = decoratedEntity;
    decoratedEntity.addDecorator(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Decorator", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("decoratedEntity", this.getDecoratedEntity());
  }
}
