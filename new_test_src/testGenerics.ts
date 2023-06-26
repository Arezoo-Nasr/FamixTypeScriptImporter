class AA {
    i <T> (j : T): void {};
}

let x = new AA();
x.i<string>("ok");
