// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { FileAnchor } from "./../famix/file_anchor";
import { SourceAnchor } from "./../famix/source_anchor";

export class MultipleFileAnchor extends SourceAnchor {

  private multipleFileAnchorAllFiles: Set<FileAnchor> = new Set();

  // @FameProperty(name = "allFiles")
  // many.getter
  public getAllFiles(): Set<FileAnchor> {
    return this.multipleFileAnchorAllFiles;
  }

  // many.Setter
  public addAllFiles(newAllFiles: FileAnchor) {
    if (!this.multipleFileAnchorAllFiles.has(newAllFiles)) {
      this.multipleFileAnchorAllFiles.add(newAllFiles);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.MultipleFileAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("allFiles", this.getAllFiles());

  }

}

