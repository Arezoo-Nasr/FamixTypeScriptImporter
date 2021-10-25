namespace MyNamespace {

	export class Animal {
	}
	export class Fish extends Animal {
	}
	export interface Flyable {
		fly() : void;
	}
	export class Bird extends Animal implements Flyable {
		fly(): void {
			throw new Error("Method not implemented.");
		}
	}

}