// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourcedEntity } from "./../famix/sourced_entity";

export class Association extends SourcedEntity {

  private associationNext: Association;

  // @FameProperty(name = "next", opposite = "previous", derived = true)
  public getNext(): Association {
    return this.associationNext;
  }

  public setNext(newNext: Association) {
    if (this.associationNext === undefined) {
      this.associationNext = newNext;
      newNext.setPrevious(this);
    }
  }

  private associationPrevious: Association;

  // @FameProperty(name = "previous", opposite = "next")
  public getPrevious(): Association {
    return this.associationPrevious;
  }

  public setPrevious(newPrevious: Association) {
    if (this.associationPrevious === undefined) {
      this.associationPrevious = newPrevious;
      newPrevious.setNext(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Association", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("next", this.getNext());
    exporter.addProperty("previous", this.getPrevious());

  }

}

