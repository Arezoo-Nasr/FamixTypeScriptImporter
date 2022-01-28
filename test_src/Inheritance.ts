namespace MyNamespace {

	export interface MyGenInterface<T> {
		name: string;
		insert(object: T): boolean;
		get(id: number): T;
		getAll(): [T];
	}

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