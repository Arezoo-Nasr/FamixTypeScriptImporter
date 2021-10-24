namespace Namespace1 {
	export class class1 {
		public name1: string;
		
		constructor() {
			this.name1 = "Arezoo";
			
		}
	}
}

namespace Namespace2 {
	export class class2 {
		private cls1: Namespace1.class1 = new Namespace1.class1();
	
		public method2() {
			var var2: string;
			var2 = this.cls1.name1 ;
		}
	}
}
