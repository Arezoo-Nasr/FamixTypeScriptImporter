namespace MyNamespace {    
     
    export class Animal {
        public name: string;
		constructor(){
			this.name = "Arezoo";
		}
        public move(): void {}
     
		public move2(family : string):void{
			var vari:string = "salam" + family;
			this.name = family;
		}
    }
	class class2{
		public cls2 : number;
	}
	namespace Nsp2{
		class clsInNsp{
			public udf2(): string{
				return "Hiiii";
			}
		}
	}
	var x = 2;
}