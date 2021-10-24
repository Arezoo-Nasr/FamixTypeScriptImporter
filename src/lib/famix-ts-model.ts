// MSE types
// These will change if the JSON from the PEG.js grammar changes, but not automatically
// It helps with code completion in VSCode

export interface FamixTypeScriptRepository {
    elementNamePrefix: string;
    nodes: FamixTypeScriptElement[];

    // // take raw JSON and transform it
    // constructor(jsonNodes: any, elementNamePrefix?: string) {
    //     this.elementNamePrefix = elementNamePrefix;
    //     this.nodes = new Array<Element>();
    //     jsonNodes.nodes.forEach(jsonElement => this.nodes.push(new Element(jsonElement, elementNamePrefix)));
    // }

}

export interface FamixTypeScriptElement {
    elementNamePrefix: string
    FM3: string
    name: string
    id?: string
    attrs: FamixTypeScriptAttr[]

    // constructor(jsonElement: any, elementNamePrefix?: string) {
    //     this.elementNamePrefix = elementNamePrefix;
    //     this.name = jsonElement.name;
    //     this.id = jsonElement.id;
    //     this.attrs = new Array<Attr>();
    //     jsonElement.attrs.forEach(attr => this.attrs.push(new Attr(attr)));
    // }

    // getFirstValueForAttr(attrToFind: string): string {
    //     let result: Array<Attr> = this.attrs.filter(attr => attr.name == attrToFind);
    //     const numberFound = result.length;

    //     if (numberFound == 1) return result[0].vals[0];
    //     return '';
    // }
    // public toMSE(): string {
    //     let result: string = '\t';
    //     result += MSEDocument.OPEN_TOKEN + this.elementNamePrefix + this.name + ' ';
    //     if (this.id) {
    //         result += MSEDocument.OPEN_TOKEN + 'id: ' + this.id + MSEDocument.CLOSE_TOKEN
    //     };
    //     this.attrs.forEach(attr => result += '\n' + attr.toMSE());
    //     result += MSEDocument.CLOSE_TOKEN;
    //     return result;
    // };
}

export interface FamixTypeScriptAttr {
    name: string;
    vals: any[];

    // constructor(jsonAttr: any) {
    //     this.name = jsonAttr.name;
    //     this.vals = new Array<any>();
    //     jsonAttr.vals.forEach(val => this.vals.push(val));
    // }

    // public toMSE(): string {
    //     let result: string = '\t\t' + MSEDocument.OPEN_TOKEN;
    //     result += this.name;
    //     result += this.valsToMSE();
    //     result += MSEDocument.CLOSE_TOKEN;
    //     return result;
    // }

    // public valsToMSE(): string {
    //     let result: string = '';
    //     // parse the vals
    //     // here it's raw JSON
    //     let vals = this.vals;
    //     if (vals.length == 1) {
    //         if (typeof vals[0] === 'string') result+= ' ' + vals[0]; 
    //         else {
    //             const o = this.vals[0]; // object
    //             result += ' ' + MSEDocument.OPEN_TOKEN;
    //             for (let [key, value] of Object.entries(o)) {
    //                 result += key + ': ' + value;
    //             }
    //             result += MSEDocument.CLOSE_TOKEN;
    //         }
    //     } else if (vals.length > 1) {
    //         vals.forEach(val => result += ' ' + val);
    //     } else throw new Error("Unknown value type at Attr name: " + this.name + " with: " + this.vals.length + " values. " + JSON.stringify(this.vals));
            
    //     return result;
    // }
}
