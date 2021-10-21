namespace MyNamespace {

	export class EntityClass {
		public name: string;
		constructor() {
			this.name = "Arezoo";
		}
		public move(): void { }

		public move2(family: string): void {
			var Str1: string = "hi" + family;
			this.name = family + Str1;
		}
	}

	class class2 {
		public cls2: number;
	}
	namespace Nsp2 {
		class clsInNsp {
			public udf2(): string {
				return "Hiiii";
			}
		}
	}

}
class clsOutNsp {
	public att1: number = 10;
	public udf(): string {
		return "Hiiii in out of namespace";
	}
}

namespace Nsp3 {
	class clsInNsp3 {
		public udf3(): string {
			return "Hiiii";
		}
	}
}