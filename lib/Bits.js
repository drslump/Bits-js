// Bits v1.0
//
// Simple and fast bitset implementation in Javascript
//
// TODO: Add support for Typed Arrays (http://www.khronos.org/registry/typedarray/specs/latest/)
// TODO: Add support for Node's Buffers (http://nodejs.org/docs/v0.5.6/api/buffers.html)
//
// Licensed under the MIT License
// Copyright 2011 Iván -DrSlump- Montes <drslump@pollinimini.net>

;(function(exports){

    /**
     * Create a new bit set. If the size is given it will allocate the array up front,
     * which will speed up the writes, limiting the operations to the given size. Otherwise
     * an empty array is created, which will grow when neededcouncountt.
     *
     * Note: The size must be a multiple of 32, othewise it will be rounded up to the next
     * multiple of 32 automatically.
     *
     * Filling the bit set with a value doubles the performance of the test operation
     * on an empty set. Performing the bitwise operations against an _undefined_ value
     * requires a type cast which can be avoided by initializing the set.
     *
     * If you need a non fixed set but prefer to initialize the set with a given size
     * for performance reassons you can set the .fixed property to false once the 
     * object has been created.
     *
     *     var bits = new Bits(1000);
     *     bits.fixed = false;
     *
     *
     * @constructor
     * @param {Number} size
     * @param {Number} fill - either 0 or 1
     */
    function Bits(size, fill){
        this.reset(size, fill);
    }

    Bits.prototype = {

       /**
        * Reset the bit set with new settings
        * @see Bits
        * @param {Number} size
        * @param {Number} fill - either 0 or 1
        */
       reset: function(size, fill){
            this.fixed = size ? true : false;
            this.size = size ? Math.ceil(size/32) * 32 : null;
            this.buckets = size ? new Array(Math.ceil(size/32)): [];
            if (typeof fill !== 'undefined' && fill !== null) {
                this.fill(fill);
            }
        },

        /**
         * Check if the bit set has a fixed size
         * @return {Boolean}
         */
        isFixed: function(){
            return this.fixed;
        },

        /**
         * Obtain the current size of bit set
         * @return {Number}
         */
        count: function(){
            return this.fixed ? this.size : this.buckets.length * 32;
        },

        /**
         * Check if a bit is set
         * @param {Number} ofs
         * @return {Boolean}
         */
        test: function(ofs){
            if (this.fixed && ofs >= this.size) return false;
            return !!(this.buckets[ofs >> 5] & (1 << (ofs & 31)));
        },

        /**
         * Set a bit
         * @param {Number} ofs
         */
        set: function(ofs){
            if (this.fixed && ofs >= this.size) return;
            this.buckets[ofs >> 5] |= 1 << (ofs & 31);
        },

        /**
         * Unset a bit
         * @param {Number} ofs
         */
        unset: function(ofs){
            if (this.fixed && ofs >= this.size) return;
            this.buckets[ofs >> 5] &= ~(1 << (ofs & 31));
        },

        /**
         * Toggle a bit
         * @param {Number} ofs
         */
        toggle: function(ofs){
            if (this.fixed && ofs >= this.size) return;
            this.buckets[ofs >> 5] ^= 1 << (ofs & 31);
        },

        /**
         * Fills the whole set with the given bit value (0 or 1)
         * @param {Number} bit - 0 or 1
         */
        fill: function(bit){
            var len = this.buckets.length;
            bit = bit ? -1 : 0;
            while (len--) {
                this.buckets[len] = bit;
            }
        },

        /**
         * Clone the current set
         * @return {Bits}
         */
        clone: function(){
            var b = new Bits();
            b.buckets = this.toBuckets();
            b.size = this.size;
            b.fixed = this.fixed;
            return b;
        },

        /**
         * Export a copy of the current bit buckets
         * @return {Array}
         */
        toBuckets: function(){
            return [].concat(this.buckets);
        },

        /**
         * Export the set as a binary string with '0' and '1'
         * @return {String}
         */
        toString: function(){
            var arr = this.toArray(), len = arr.length;

            while (len--) arr[len] = 0 + arr[len];

            return arr.join('');
        },

        /**
         * Export the set an hexadecimal string
         * @return {String}
         */
        toHex: function(){
            var i, hex, zeros = '00000000', arr = [],
                len = this.buckets.length;

            for (i=0; i<len; i++) {
                hex = this.buckets[i] ? this.buckets[i].toString(16) : ''
                hex = zeros.substr(0, zeros.length-hex.length) + hex;
                arr.push(hex);
            }

            return arr.join('');
        },

        /**
         * Export the set as an array of boolean values
         * @return {Array}
         */
        toArray: function(){
            var i,
                len = this.count(),
                arr = new Array(len);
            while (len--) {
                arr[len] = this.test(len);
            }

            return arr;
        },

        /**
         * Compares against another bit set
         * @param {Bits} bits
         * @return {Boolean}
         */
        equals: function(bits){
            var pos = this.buckets.length;
            if (pos !== bits.buckets.length) return false;
            while (pos--) {
                // Do not use equal type to support undefined buckets
                if (this.buckets[pos] != bits.buckets[pos]) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Performs a Not operation on the set
         * @return {Bits} - Fluent interface
         */
        not: function(){
            var pos = this.buckets.length;
            while (pos--) {
                this.buckets[pos] = ~this.buckets[pos];
            }
            return this;
        },

        /**
         * Performs an Or operation on the set
         * @param {Bits} bits
         * @return {Bits} - Fluent interface
         */
        or: function(bits){
            var len = Math.min(this.buckets.length, bits.buckets.length);
            while (len--) {
                this.buckets[len] |= bits.buckets[len];
            }
            return this;
        },

        /**
         * Performs an And operation on the set
         * @param {Bits} bits
         * @return {Bits} - Fluent interface
         */
        and: function(bits){
            var rem, len = Math.min(this.buckets.length, bits.buckets.length);

            // Unset all remaining bits if the set is larger
            if (len < this.buckets.length) {
                rem = this.buckets.length * 32 - len * 32;
                while (rem--) {
                    this.unset(len * 32 + rem);
                }
            }

            while (len--) {
                this.buckets[len] &= bits.buckets[len];
            }

            return this;
        },

        /**
         * Performs a Xor operation on the set
         * @param {Bits} bits
         * @return {Bits} - Fluent interface
         */
        xor: function(bits){
            var len = Math.min(this.buckets.length, bits.buckets.length);
            while (len--) {
                this.buckets[len] ^= bits.buckets[len];
            }
            return this;
        }

    };

    // Static methods

    /**
     * Create a set from previously exported buckets
     * @static
     * @param {Array} buckets
     * @return {Bits}
     */
    Bits.fromBuckets = function(buckets){
        var bits = new Bits();
        bits.buckets = [].concat(buckets);
        return bits;
    };

    /**
     * Create a set from a string of '0' and '1' characters
     * @static
     * @param {String} str
     * @return {Bits}
     */
    Bits.fromString = function(str){
        var len = str.length,
            bits = new Bits(len);

        while (len--) if (str.charAt(len) === '1') {
            bits.set(len);
        }

        return bits;
    };

    /**
     * Create a set from a string of hex characters
     * @static
     * @param {String} hex
     * @return {Bits}
     */
    Bits.fromHex = function(hex){
        var i, len = hex.length,
            buckets = [];

        for (i=0; i<len; i+=8) {
            buckets.push( parseInt(hex.substr(i,8), 16) );
        }

        return Bits.fromBuckets(buckets);
    }

    /**
     * Create a set from an array of boolean values
     * @static
     * @param {Array} arr
     * @return {Bits}
     */
    Bits.fromArray = function(arr){
        var len = arr.length,
            bits = new Bits(len);

        while (len--) if (arr[len]) {
            bits.set(len);
        }

        return bits;
    };

    /**
     * Perform a Not operation on the given set
     * @static
     * @param {Bits} str
     * @return {Bits}
     */
    Bits.not = function(a){
        return a.clone().not();
    };

    /**
     * Perform an Or operation on the given sets
     * @static
     * @param {Bits} a
     * @param {Bits} b
     * @return {Bits}
     */
    Bits.or = function(a, b){
        return a.clone().or(b);
    };

    /**
     * Perform an And operation on the given sets
     * @static
     * @param {Bits} a
     * @param {Bits} b
     * @return {Bits}
     */
    Bits.and = function(a, b){
        return a.clone().and(b);
    };

    /**
     * Perform a Xor operation on the given sets
     * @static
     * @param {Bits} a
     * @param {Bits} b
     * @return {Bits}
     */
    Bits.xor = function(a, b){
        return a.clone().xor(b);
    };

    /**
     * Checks if two sets are equal
     * @static
     * @param {Bits} a
     * @param {Bits} b
     * @return {Boolean}
     */
    Bits.equals = function(a, b){
        return a.equals(b);
    };



    // Export the class into the global namespace or for CommonJs
    exports.Bits = Bits;

})(typeof exports !== "undefined" ? exports : this);

