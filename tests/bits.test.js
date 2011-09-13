var assert = require('assert'),
    Bits = require('./../lib/Bits.js').Bits,
    bits;


// Create a non-fixed set
bits = new Bits();
assert.equal(0, bits.count());

bits.set(10);
assert.equal(10, bits.toString().indexOf(1));
assert.equal(32, bits.count());

bits.set(50);
assert.equal(50, bits.toString().lastIndexOf(1));
assert.equal(64, bits.count());


// Create from string
bits = Bits.fromString('0001000100010');
assert.ok(bits.test(3));
assert.equal('00010001000100000000000000000000', bits.toString());

bits = Bits.fromString('10101010100000000000000000000000');
assert.equal('00000155', bits.toHex());

bits = Bits.fromHex('155');
assert.equal('10101010100000000000000000000000', bits.toString());

