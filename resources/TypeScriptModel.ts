

	export namespace MyNamespace {

		export class class1 {
			protected projectName: string;

			constructor() {
				this.projectName = "Support for TypeScript";
			}
		}

		export interface interface1 {

		}

		export class class2 extends class1 implements interface1 {

			public getName(university: string): string {
				var finalString: string = this.projectName + "in Moose" + university;
				return finalString;
			}
		}
	}

	function function1() {
		var localVar = "hi";
	}

