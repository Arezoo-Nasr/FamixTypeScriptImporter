import { FamixBaseElement } from "./famix_base_element";

type RefType = {
  ref: number
}

export interface FamixTypeScriptElementStorage {
    FM3: string
    name: string
    id?: string
    accessor?: RefType
    variable?: RefType
}

/**
 * This class is used to export Famix elements to JSON
 */
export class FamixJSONExporter {

  private element: FamixBaseElement;
  private bufferArray: any = {};
  private FamixPrefix = "FamixTypeScript";

  constructor(packageClass: string, element: FamixBaseElement) {
    this.element = element;
    this.bufferArray["FM3"] = this.FamixPrefix + "." + packageClass;
    this.bufferArray["id"] = this.element.id;
  }

  public addProperty(name: string, prop: unknown): void {
    if (prop === undefined) { return; }
    if ((prop instanceof Set) && (prop.size === 0)) { return; }

    if (prop instanceof Set) {
      const valueArray = [];
      for (const value of Array.from(prop.values())) {
        if (typeof (value) === "string") {
          valueArray.push(value);
        } 
        else if (value instanceof FamixBaseElement) {
          valueArray.push({ "ref": value.id });
        }
        else {
          valueArray.push(value);
        }
      }
      this.bufferArray[name] = valueArray;
    }
    else if (prop instanceof FamixBaseElement) {
      this.bufferArray[name] = { "ref": prop.id };
    } 
    else if (typeof (prop) === "string") {
      this.bufferArray[name] = prop;
    } 
    else {
      this.bufferArray[name] = prop;
    }
  }

  public getJSON(): string {
    return JSON.stringify(this.bufferArray);
  }
}
