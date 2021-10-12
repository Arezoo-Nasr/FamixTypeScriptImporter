// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Entity } from "./../famix/entity";
import { SourcedEntity } from "./../famix/sourced_entity";

export class SourceAnchor extends Entity {

  private sourceAnchorElement: SourcedEntity;

  // @FameProperty(name = "element", opposite = "sourceAnchor")
  public getElement(): SourcedEntity {
    return this.sourceAnchorElement;
  }

  public setElement(newElement: SourcedEntity) {
    if (this.sourceAnchorElement === undefined) {
      this.sourceAnchorElement = newElement;
      newElement.setSourceAnchor(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("SourceAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("element", this.getElement());

  }

}

