class AA {
    i <T> (j : T): void {true;}
}

const x = new AA();
x.i<string>("ok");
