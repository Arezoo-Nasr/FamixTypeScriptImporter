export namespace MyNamespace {

	export class class1 {
		protected projectName: string;

		constructor() {
			this.projectName = "Support for TypeScript";
		}

		public getName(university: string): string {
			var finalString: string = this.projectName + "in Moose" + university;
			return finalString;
		}

	}

	export interface interface1 {
		att1: string;
	}

	export class class2 extends class1 implements interface1 {
		att1: string = "";
		public func() {
			var x = this.projectName;
		}
	}
}

function function1() {
	var localVar = "hi";
}