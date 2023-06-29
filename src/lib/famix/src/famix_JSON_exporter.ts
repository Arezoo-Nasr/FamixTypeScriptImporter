import { FamixBaseElement } from "./famix_base_element";

type RefType = {
  ref: number
}
// approximation for code completion
export interface FamixTypeScriptElementStorage {
    FM3: string
    name: string
    id?: string
    accessor?: RefType
    variable?: RefType
}

export class FamixJSONExporter {
  private element: FamixBaseElement;
  private bufferArray: any = []
  //Arezoo
  private FamixPrefix = "FamixTypeScript";
  //End
  constructor(packageClass: string, element: FamixBaseElement) {
    this.element = element;
    //this.buffer = `(${packageClass}  (id: ${this.element.id})`;
    //this.buffer = `{ FM3 : ${packageClass} , id : ${this.element.id} `;
    this.bufferArray["FM3"] = this.FamixPrefix + "." + packageClass;
    this.bufferArray["id"] = this.element.id;
  }

  public addProperty(name: string, prop: unknown) {
    if (prop === undefined) { return; }
    if ((prop instanceof Set) && (prop.size === 0)) { return; }

    if (prop instanceof Set) {
      const valueBuffer = "";
      const valueArray = [];
      for (const value of Array.from(prop.values())) {
        if (valueBuffer.length > 0) {
          //valueBuffer = valueBuffer + " ";
        }
        if (typeof (value) === "string") {
          //valueBuffer = valueBuffer + `'${value}'`;
          valueArray.push(value);

        } else if (value instanceof FamixBaseElement) {
          //valueBuffer = valueBuffer + `(ref: ${value.id})`;
          valueArray.push({ "ref": value.id });

        } else {
          //valueBuffer = valueBuffer + `${value}`;
          valueArray.push(value);
        }
      }
      //this.buffer = this.buffer + `\n    (${name} ${valueBuffer})`;
      this.bufferArray[name] = valueArray;
    }
    else if (prop instanceof FamixBaseElement) {
      this.bufferArray[name] = { "ref": prop.id };
    } else if (typeof (prop) === "string") {
      this.bufferArray[name] = prop;
    } else {
      this.bufferArray[name] = prop;
    }
    // else if (prop instanceof FamixBaseElement) {
    //   this.buffer = this.buffer + `\n    (${name} (ref: ${prop.id}))`;
    // } else if (typeof (prop) === "string") {
    //   this.buffer = this.buffer + `\n    (${name} '${prop}')`;
    // } else {
    //   this.buffer = this.buffer + `\n    (${name} ${prop})`;
    // }
  }

  public getJSON(): string {
    //return this.buffer + ")\n";
    return JSON.stringify(this.bufferArray);
  }
}
