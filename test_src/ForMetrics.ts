export class ForMetrics {
    public name: string;

    constructor() {
        this.name = "Arezoo";
    }

    public methodCyclomaticOne(): void { }

    public methodCyclomaticFour(family: string): void {
        var Str1: string = "hi" + family;
        this.name = family + Str1;
        // make higher cyclomatic complexity
        for (let i = 0; i < 50; i++) { // 2
            for (let j = 0; j < 50; j++) { // 3
                if (i < 10) console.log(i) // 4
            }
        }
    }
}
export class Fish extends Animal {
    private color: string;
    constructor() {
        super();
        this.color = "red";
    }
}
