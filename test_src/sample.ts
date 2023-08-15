
var x = "hello";

export class ClassA {
    aFred: number;
    aWilma: "green" | "blue" | 12;
    aMethod1(aMethodArg1: string) {
        return aMethodArg1 + "!";
        function fInAMethod() {
            function fInfInAMethod() {
                var w = 0;
            }
        }
}    
}

namespace ANamespace {
    var w = 15;
    let x;
    x = w;
    class B {
        bFred: number;
        bWilma: "yellow" | "red";
        bMethod1(bMethodArg1: number) {
            let varInBMethod;
            return bMethodArg1 + 1;
            function fInBMethod() {
                let varInFInBMethod;
                function fInfInBMethod() {
                    var w = 0;
                }
            }
        }
    }
    let b = new B();
}

export const y = 12.5;

function f() {
    var k = 0;
    { var blockVar = 66; }
    switch (k) {
        case 0:
            var kSwitchCase = 99;
            break;
        default:
            var kSwitchDefault = 90;
    }
    if (true) {
        var ifBlockL = 12;
    }
    let cond = true;
    do {
        var doBlockL = 8;
        cond = false;
    } while (cond);
    try {
        var tryBlockL = 1;
    } catch (error) {
        var catchBlockL = 12;
    }
    while (false) {
        var kWhile = 9;
    }
    let array = [1, 2, 3];
    for (let forIndex = 0; forIndex < array.length; forIndex++) {
        const elementInFor = array[forIndex];
    }
    let object = {};
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const elementInForIn = object[key];
        }
    }
    for (const iterator of array) {
        let elementInForOf = "blah";
    }
    g();

    function g() {
        var a_G: string;
        h();

        function h() {
            var a_H: string;
            i();

            function i() {
                var a_I: string;

                console.info("Hello");

                try {
                    let tryX = 0;
                } catch (error) {
                    let catchY = 15;
                } finally {
                    let finallyZ = 99;
                }
            }
        }
    }
}