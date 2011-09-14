(function(){

var Benchmark = require('benchmark'),
    Bits = require('./../lib/Bits.js').Bits;

var bits = new Bits();

var suite = new Benchmark.Suite();

suite
.add('Sparse Bits#set', function(){
    bits.set(1200);
    bits.set(1500);
    bits.set(8000);
}, { onStart: function(){ bits.reset(); } })
.add('Sparse Bits#test', function(){
    bits.test(1000);
    bits.test(1500);
    bits.test(9000);
}, { onStart: function(){ bits.reset(); } })

.add('Fixed non-filled Bits#set', function(){
    bits.set(1200);
    bits.set(1500);
    bits.set(8000);
}, { onStart: function(){ bits.reset(10000); } })
.add('Fixed non-filled Bits#test', function(){
    bits.test(1000);
    bits.test(1500);
    bits.test(9000);
}, { onStart: function(){ bits.reset(10000); } })

.add('Fixed filled Bits#set(fill)', function(){
    bits.set(1200);
    bits.set(1500);
    bits.set(8000);
}, { onStart: function(){ bits.reset(10000, 0); } })
.add('Fixed filled Bits#test(fill)', function(){
    bits.test(1000);
    bits.test(1500);
    bits.test(9000);
}, { onStart: function(){ bits.reset(10000, 0); } })


.on('cycle', function(event, bench){ console.log(String(bench)); })

.run();

})();
