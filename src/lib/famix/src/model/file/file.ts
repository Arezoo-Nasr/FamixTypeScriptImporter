// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {AbstractFile} from "./../file/abstract_file";

export class File extends AbstractFile {

  private fileNumberOfInternalClones: number;

  // @FameProperty(name = "numberOfInternalClones")
  public getNumberOfInternalClones(): number {
    return this.fileNumberOfInternalClones;
  }

  public setNumberOfInternalClones(fileNumberOfInternalClones: number) {
    this.fileNumberOfInternalClones = fileNumberOfInternalClones;
  }

  private fileTotalNumberOfLinesOfText: number;

  // @FameProperty(name = "totalNumberOfLinesOfText")
  public getTotalNumberOfLinesOfText(): number {
    return this.fileTotalNumberOfLinesOfText;
  }

  public setTotalNumberOfLinesOfText(fileTotalNumberOfLinesOfText: number) {
    this.fileTotalNumberOfLinesOfText = fileTotalNumberOfLinesOfText;
  }

  private fileNumberOfKiloBytes: number;

  // @FameProperty(name = "numberOfKiloBytes")
  public getNumberOfKiloBytes(): number {
    return this.fileNumberOfKiloBytes;
  }

  public setNumberOfKiloBytes(fileNumberOfKiloBytes: number) {
    this.fileNumberOfKiloBytes = fileNumberOfKiloBytes;
  }

  private fileNumberOfDuplicatedFiles: number;

  // @FameProperty(name = "numberOfDuplicatedFiles")
  public getNumberOfDuplicatedFiles(): number {
    return this.fileNumberOfDuplicatedFiles;
  }

  public setNumberOfDuplicatedFiles(fileNumberOfDuplicatedFiles: number) {
    this.fileNumberOfDuplicatedFiles = fileNumberOfDuplicatedFiles;
  }

  private fileNumberOfEmptyLinesOfText: number;

  // @FameProperty(name = "numberOfEmptyLinesOfText")
  public getNumberOfEmptyLinesOfText(): number {
    return this.fileNumberOfEmptyLinesOfText;
  }

  public setNumberOfEmptyLinesOfText(fileNumberOfEmptyLinesOfText: number) {
    this.fileNumberOfEmptyLinesOfText = fileNumberOfEmptyLinesOfText;
  }

  private fileNumberOfCharacters: number;

  // @FameProperty(name = "numberOfCharacters")
  public getNumberOfCharacters(): number {
    return this.fileNumberOfCharacters;
  }

  public setNumberOfCharacters(fileNumberOfCharacters: number) {
    this.fileNumberOfCharacters = fileNumberOfCharacters;
  }

  private fileAverageNumberOfCharactersPerLine: number;

  // @FameProperty(name = "averageNumberOfCharactersPerLine")
  public getAverageNumberOfCharactersPerLine(): number {
    return this.fileAverageNumberOfCharactersPerLine;
  }

  public setAverageNumberOfCharactersPerLine(fileAverageNumberOfCharactersPerLine: number) {
    this.fileAverageNumberOfCharactersPerLine = fileAverageNumberOfCharactersPerLine;
  }

  private fileNumberOfLinesOfText: number;

  // @FameProperty(name = "numberOfLinesOfText")
  public getNumberOfLinesOfText(): number {
    return this.fileNumberOfLinesOfText;
  }

  public setNumberOfLinesOfText(fileNumberOfLinesOfText: number) {
    this.fileNumberOfLinesOfText = fileNumberOfLinesOfText;
  }

  private fileNumberOfExternalClones: number;

  // @FameProperty(name = "numberOfExternalClones")
  public getNumberOfExternalClones(): number {
    return this.fileNumberOfExternalClones;
  }

  public setNumberOfExternalClones(fileNumberOfExternalClones: number) {
    this.fileNumberOfExternalClones = fileNumberOfExternalClones;
  }

  private fileNumberOfInternalMultiplications: number;

  // @FameProperty(name = "numberOfInternalMultiplications")
  public getNumberOfInternalMultiplications(): number {
    return this.fileNumberOfInternalMultiplications;
  }

  public setNumberOfInternalMultiplications(fileNumberOfInternalMultiplications: number) {
    this.fileNumberOfInternalMultiplications = fileNumberOfInternalMultiplications;
  }

  private fileNumberOfBytes: number;

  // @FameProperty(name = "numberOfBytes")
  public getNumberOfBytes(): number {
    return this.fileNumberOfBytes;
  }

  public setNumberOfBytes(fileNumberOfBytes: number) {
    this.fileNumberOfBytes = fileNumberOfBytes;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FILE.File", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("averageNumberOfCharactersPerLine", this.getAverageNumberOfCharactersPerLine());
    exporter.addProperty("numberOfInternalClones", this.getNumberOfInternalClones());
    exporter.addProperty("totalNumberOfLinesOfText", this.getTotalNumberOfLinesOfText());
    exporter.addProperty("numberOfKiloBytes", this.getNumberOfKiloBytes());
    exporter.addProperty("numberOfDuplicatedFiles", this.getNumberOfDuplicatedFiles());
    exporter.addProperty("numberOfLinesOfText", this.getNumberOfLinesOfText());
    exporter.addProperty("numberOfEmptyLinesOfText", this.getNumberOfEmptyLinesOfText());
    exporter.addProperty("numberOfCharacters", this.getNumberOfCharacters());
    exporter.addProperty("numberOfExternalClones", this.getNumberOfExternalClones());
    exporter.addProperty("numberOfInternalMultiplications", this.getNumberOfInternalMultiplications());
    exporter.addProperty("numberOfBytes", this.getNumberOfBytes());

  }

}

