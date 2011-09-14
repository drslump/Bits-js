// Load dependencies when run from the shell
if (typeof require !== 'undefined') {
    var Bits = require('./../lib/Bits.js').Bits;
}

describe('Bits', function(){
    var a, b, bits;

    beforeEach(function(){
        bits = a = b = null;
    });

    describe('Growing Bit Set', function(){

        it('should set and test bits', function(){

            bits = new Bits();

            expect(bits.test(0)).toEqual(false);
            bits.set(10);
            expect(bits.test(10)).toEqual(true);
            bits.set(100);
            expect(bits.test(100)).toEqual(true);
        });

        it('should unset bits', function(){

            bits = new Bits();

            bits.set(10);
            expect(bits.test(10)).toEqual(true);
            bits.unset(10);
            expect(bits.test(10)).toEqual(false);

            bits.set(100);
            expect(bits.test(100)).toEqual(true);
            bits.unset(100);
            expect(bits.test(100)).toEqual(false);
        });

    });

    describe('Fixed Bit Set', function(){
        it('should set and test bits', function(){
            bits = new Bits(1000);

            expect(bits.test(0)).toEqual(false);
            bits.set(10);
            expect(bits.test(10)).toEqual(true);
            bits.set(100);
            expect(bits.test(100)).toEqual(true);
        });

        it('should unset bits', function(){
            bits = new Bits(1000);

            bits.set(10);
            expect(bits.test(10)).toEqual(true);
            bits.unset(10);
            expect(bits.test(10)).toEqual(false);

            bits.set(100);
            expect(bits.test(100)).toEqual(true);
            bits.unset(100);
            expect(bits.test(100)).toEqual(false);
        });
    });

});
