var x = "hello";

class A {
    aFred: number;
    aWilma: "green" | "blue" | 12;
    aMethod1(aMethodArg1: string) {
        return aMethodArg1 + "!"
    }    
}

namespace A {
    var w = 15;
    class B {
        bFred: number;
        bWilma: "yellow" | "red";
        bMethod1(bMethodArg1: number) {
            return bMethodArg1 + 1;
        }
    }
}

export const y = 12.5;

function f() {
    var k = 0;
    if (true) {
        var ifBlockL = 12;
    }
    let cond = true;
    do {
        var doBlockL = 8
        cond = false;
    } while (cond);
    try {
        var tryBlockL = 1;
    } catch (error) {
        var catchBlockL = 12;
    }
    g();

    function g() {
        var a_G: string;
        h()

        function h() {
            var a_H: string;
            i();

            function i() {
                var a_I: string;

                console.info("Hello")

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