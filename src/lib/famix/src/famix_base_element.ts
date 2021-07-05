import {FamixMseExporter} from "./famix_mse_exporter";
import {FamixRepository} from "./famix_repository";

export abstract class FamixBaseElement {

  public id: number;

  constructor(repo: FamixRepository) {
    repo.addElement(this);
  }

  public abstract getMSE(): string;

  // @ts-ignore
  // tslint:disable-next-line:no-empty
  public addPropertiesToExporter(exporter: FamixMseExporter): void {
  }

}
