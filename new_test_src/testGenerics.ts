class AA {
    i<T> (j : T): void {}
}

const x = new AA();
x.i<string>("ok");
