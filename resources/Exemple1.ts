namespace MyNamespace {

	class class1 {
		private projectName: string;

		constructor() {
			this.projectName = "Support for TypeScript";
		}

		public getName(university: string): string {
			var finalString: string = this.projectName + "in Moose" + university;
			return finalString;
		}
	}

	class class2 {
		public getString() {
			var class1Obj = new class1();
			var returnValue1 = class1Obj.getName("ETS");
		}
	}
}

