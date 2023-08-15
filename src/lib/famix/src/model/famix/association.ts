import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { SourcedEntity } from "./sourced_entity";

export class Association extends SourcedEntity {

  private associationNext: Association;

  public getNext(): Association {
    return this.associationNext;
  }

  public setNext(associationNext: Association): void {
    if (this.associationNext === undefined) {
      this.associationNext = associationNext;
      associationNext.setPrevious(this);
    }
  }

  private associationPrevious: Association;

  public getPrevious(): Association {
    return this.associationPrevious;
  }

  public setPrevious(associationPrevious: Association): void {
    if (this.associationPrevious === undefined) {
      this.associationPrevious = associationPrevious;
      associationPrevious.setNext(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Association", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("next", this.getNext());
    exporter.addProperty("previous", this.getPrevious());
  }
}
