import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { SourcedEntity } from "./sourced_entity";

export class Association extends SourcedEntity {

  private next: Association;

  public getNext(): Association {
    return this.next;
  }

  public setNext(next: Association): void {
    if (this.next === undefined) {
      this.next = next;
      next.setPrevious(this);
    }
  }

  private previous: Association;

  public getPrevious(): Association {
    return this.previous;
  }

  public setPrevious(previous: Association): void {
    if (this.previous === undefined) {
      this.previous = previous;
      previous.setNext(this);
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
