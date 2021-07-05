// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {AbstractFile} from "./../file/abstract_file";

export class Folder extends AbstractFile {

  private folderNumberOfFiles: number;

  // @FameProperty(name = "numberOfFiles")
  public getNumberOfFiles(): number {
    return this.folderNumberOfFiles;
  }

  public setNumberOfFiles(folderNumberOfFiles: number) {
    this.folderNumberOfFiles = folderNumberOfFiles;
  }

  private folderNumberOfFolders: number;

  // @FameProperty(name = "numberOfFolders")
  public getNumberOfFolders(): number {
    return this.folderNumberOfFolders;
  }

  public setNumberOfFolders(folderNumberOfFolders: number) {
    this.folderNumberOfFolders = folderNumberOfFolders;
  }

  private folderTotalNumberOfLinesOfText: number;

  // @FameProperty(name = "totalNumberOfLinesOfText")
  public getTotalNumberOfLinesOfText(): number {
    return this.folderTotalNumberOfLinesOfText;
  }

  public setTotalNumberOfLinesOfText(folderTotalNumberOfLinesOfText: number) {
    this.folderTotalNumberOfLinesOfText = folderTotalNumberOfLinesOfText;
  }

  private folderNumberOfLinesOfText: number;

  // @FameProperty(name = "numberOfLinesOfText")
  public getNumberOfLinesOfText(): number {
    return this.folderNumberOfLinesOfText;
  }

  public setNumberOfLinesOfText(folderNumberOfLinesOfText: number) {
    this.folderNumberOfLinesOfText = folderNumberOfLinesOfText;
  }

  private folderNumberOfEmptyLinesOfText: number;

  // @FameProperty(name = "numberOfEmptyLinesOfText")
  public getNumberOfEmptyLinesOfText(): number {
    return this.folderNumberOfEmptyLinesOfText;
  }

  public setNumberOfEmptyLinesOfText(folderNumberOfEmptyLinesOfText: number) {
    this.folderNumberOfEmptyLinesOfText = folderNumberOfEmptyLinesOfText;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FILE.Folder", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("numberOfFiles", this.getNumberOfFiles());
    exporter.addProperty("numberOfFolders", this.getNumberOfFolders());
    exporter.addProperty("totalNumberOfLinesOfText", this.getTotalNumberOfLinesOfText());
    exporter.addProperty("numberOfLinesOfText", this.getNumberOfLinesOfText());
    exporter.addProperty("numberOfEmptyLinesOfText", this.getNumberOfEmptyLinesOfText());

  }

}

