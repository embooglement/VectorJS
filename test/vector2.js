var mocha = require("mocha");
var chai = require("chai");
var describe = mocha.describe;
var it = mocha.it;
var assert = chai.assert;

var vector = require("../vector.js");
for (var prop in vector) {
	global[prop] = vector[prop];
}

var FLOATING_POINT_ERROR = require("./tests.js").FLOATING_POINT_ERROR;

describe("Vector2", function() {
	describe("constructor", function() {
		it("can call constructor without new", function() {
			var v = Vector2(1, 2);
			assert.isDefined(v);
		});
		
		it("can call constructor with new", function() {
			var v = new Vector2(1, 2);
			assert.isDefined(v);
		});
		
		it("returns an object with the given x and y coordinates", function() {
			var v = Vector2(1, 2);
			assert.equal(v.x, 1);
			assert.equal(v.y, 2);
		});
		
		it("defaults to the zero vector", function() {
			var v = Vector2();
			assert.equal(v.x, 0);
			assert.equal(v.y, 0);
		});
	});
	
	describe("clone", function() {
		it("returns a new object", function() {
			var v1 = Vector2(1, 2);
			var v2 = v1.clone();
			assert.notStrictEqual(v1, v2);
		});
		
		it("returns a new object with equivalent x and y coordinates", function() {
			var v1 = Vector2(1, 2);
			var v2 = v1.clone();
			assert.equal(v1.x, v2.x);
			assert.equal(v1.y, v2.y);
		});
	});
	
	describe("toString", function() {
		it("returns a string", function() {
			var v = Vector2(1, 2);
			assert.isString(v.toString());
		});

		it("returns a string formatted like an array", function() {
			var v = Vector2(1, 2);
			assert.equal(v.toString(), "[1, 2]"); 
		});
	});
	
	describe("toArray", function() {
		it("returns an array", function() {
			var v = Vector2(1, 2);
			assert.isArray(v.toArray());
		});
		
		it("returns an array with x and y as the values", function() {
			var v = Vector2(1, 2);
			var a = v.toArray();
			assert.deepEqual(a, [1, 2]);
		});
	});
	
	describe("length", function() {
		it("returns the magnitude of the vector", function() {
			var v1 = Vector2(0, 0);
			assert.equal(v1.length(), 0);
			
			var v2 = Vector2(1, 0);
			assert.equal(v2.length(), 1);
			
			var v3 = Vector2(1, 1);
			assert.closeTo(v3.length(), Math.sqrt(2), FLOATING_POINT_ERROR); 
		});
	});
	
	describe("direction", function() {
		it("returns the direction for vectors with non-zero magnitude", function() {
			var v1 = Vector2(1, 0);
			assert.equal(v1.direction(), 0);
			
			var v2 = Vector2(0, 1);
			assert.closeTo(v2.direction(), Math.PI / 2, FLOATING_POINT_ERROR);
			
			var v3 = Vector2(-1, 0);
			assert.closeTo(v3.direction(), Math.PI, FLOATING_POINT_ERROR);
			
			var v4 = Vector2(0, -1);
			assert.closeTo(v4.direction(), -Math.PI / 2, FLOATING_POINT_ERROR);
			
			var v5 = Vector2(1, 1);
			assert.closeTo(v5.direction(), Math.PI / 4, FLOATING_POINT_ERROR);
					
			var v6 = Vector2(2, -2);
			assert.closeTo(v6.direction(), -Math.PI / 4, FLOATING_POINT_ERROR);
		});
		
		it("is indepedent of the magnitudes of the fields", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(2, 2);
			var v3 = Vector2(0, Math.sqrt(2));
			
			assert.closeTo(v1.direction(), v2.direction(), FLOATING_POINT_ERROR);
			assert(Math.abs(v1.direction() - v3.direction()) > FLOATING_POINT_ERROR);
		});
		
		var assert_direction_throws = function(v) {
			assert.throws(v.direction.bind(v), RangeError);
		};
		
		it("throws a RangeError when the magnitude is zero", function() {
			var v = Vector2(0, 0);
			assert_direction_throws(v);
		});
		
		it("throws a RangeError when either field is infinite or NaN", function() {
			var vecs = [
				Vector2(0, Infinity),
				Vector2(Infinity, 0),
				Vector2(Infinity, Infinity),
				Vector2(Infinity, -Infinity),
				
				Vector2(0, -Infinity),
				Vector2(-Infinity, 0),
				Vector2(-Infinity, -Infinity),
				Vector2(-Infinity, Infinity),
				
				Vector2(0, NaN),
				Vector2(NaN, 0),
				Vector2(NaN, NaN),
				
				Vector2(NaN, Infinity),
				Vector2(Infinity, NaN)
			];
			
			vecs.forEach(assert_direction_throws);
		});
	});
	
	describe("negate", function() {		
		it("negates both fields", function() {
			var v1 = Vector2(1, 0);
			var v2 = v1.negate();
			
			assert.equal(v2.x, -1);
			assert.equal(v2.y, 0);
		});
	});
	
	describe("add", function() {
		it("returns a Vector2", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(2, 3);
			var sum = v1.add(v2);
			
			assert.instanceOf(sum, Vector2);
		});
				
		it("returns the vector sum", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(2, 3);
			var sum = v1.add(v2);
			
			assert.equal(sum.x, 3);
			assert.equal(sum.y, 4);
		});
		
		it("is commutative", function() {
			var v1 = Vector2(1, 2);
			var v2 = Vector2(2, 3);
			var sum1 = v1.add(v2);
			var sum2 = v2.add(v1);
			
			assert.closeTo(sum1.x, sum2.x, FLOATING_POINT_ERROR);
			assert.closeTo(sum1.y, sum2.y, FLOATING_POINT_ERROR);
		});
		
		it("is assosciative", function() {
			var v1 = Vector2(1, 2);
			var v2 = Vector2(2, 3);
			var v3 = Vector2(3, 4);
			
			var sum1 = (v1.add(v2)).add(v3);
			var sum2 = v1.add(v2.add(v3));
			
			assert.closeTo(sum1.x, sum2.x, FLOATING_POINT_ERROR);
			assert.closeTo(sum1.y, sum2.y, FLOATING_POINT_ERROR);
		});
	});
	
	describe("subtract", function() {
		it("returns the vector difference", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(2, 3);
			var diff = v1.subtract(v2);
			
			assert.equal(diff.x, -1);
			assert.equal(diff.y, -2);
		});
	});
	
	describe("multiply", function() {
		it("returns the scalar multiple of the vector", function() {
			var v = Vector2(1, 2);
			var prod = v.multiply(3);
			
			assert.equal(prod.x, 3);
			assert.equal(prod.y, 6);
		});
		
		it("is assosciative", function() {
			var v = Vector2(1, 2);
			var prod1 = v.multiply(3).multiply(4);
			var prod2 = v.multiply(3 * 4);
			
			assert.closeTo(prod1.x, prod2.x, FLOATING_POINT_ERROR);
			assert.closeTo(prod1.y, prod2.y, FLOATING_POINT_ERROR);
		});	
	});
	
	describe("divide", function() {		
		it("returns the scalar dividend of the vector", function() {
			var v = Vector2(3, 6);
			var div = v.divide(3);
			
			assert.equal(div.x, 1);
			assert.equal(div.y, 2);
		});
	});
	
	describe("dot", function() {		
		it("returns a number", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(3, 4);
			assert.isNumber(v1.dot(v2));
		});
		
		it("returns the dot product", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(2, 3);
			var v3 = Vector2(0, 0);
			var v4 = Vector2(-1, -3);
			
			assert.closeTo(v1.dot(v2), 5, FLOATING_POINT_ERROR);
			assert.closeTo(v1.dot(v3), 0, FLOATING_POINT_ERROR);
			assert.closeTo(v2.dot(v3), 0, FLOATING_POINT_ERROR);
			assert.closeTo(v1.dot(v4), -4, FLOATING_POINT_ERROR);
			assert.closeTo(v2.dot(v4), -11, FLOATING_POINT_ERROR);
		});
		
		it("is commutative", function() {
			var v1 = Vector2(2, 3);
			var v2 = Vector2(-1, -2);
			var prod1 = v1.dot(v2);
			var prod2 = v2.dot(v1);
			
			assert.closeTo(prod1, prod2, FLOATING_POINT_ERROR);
		});
	});
	
	describe("transform", function() {
		it("returns the product of the vector and the matrix", function() {
			var v = Vector2(1, 2);
			var m = Matrix3([
				[2, 0, 0],
				[0, 3, 0],
				[0, 0, 1]
			]);
			var prod = v.transform(m);
			
			assert.closeTo(prod.x, 2, FLOATING_POINT_ERROR);
			assert.closeTo(prod.y, 6, FLOATING_POINT_ERROR);
		});
	});
	
	describe("normalize", function() {
		it("returns a unit vector in the same direction", function() {
			var v = Vector2(1, 1);
			var len = v.length();
			var norm = v.normalize();
			
			assert.closeTo(norm.length(), 1, FLOATING_POINT_ERROR);
			assert.closeTo(norm.direction(), v.direction(), FLOATING_POINT_ERROR);
			assert.closeTo(norm.x, v.x / len, FLOATING_POINT_ERROR);
			assert.closeTo(norm.y, v.y / len, FLOATING_POINT_ERROR);
		});
	});
	
	describe("equals", function() {
		it("returns a boolean", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(1, 1);
			
			assert.isBoolean(v1.equals(v2));
		});
		
		it("compares each field for equality", function() {
			var v1 = Vector2(1, 1);
			var v2 = Vector2(1, 1);
			var v3 = Vector2(2, 3);
			
			assert(v1.equals(v2));
			assert(!v1.equals(v3));
		});
	});
	
	describe("outOfBounds", function() {
		it("returns a boolean", function() {
			var v = Vector2(0, 0);
			var top_left = Vector2(1, 0)
			var bottom_right = Vector2(0, 1);
			assert.isBoolean(v.outOfBounds(top_left, bottom_right));
		});
		
		it("returns whether the vector is contained within a box", function() {
			var v = Vector2(0, 0);
			assert(!v.outOfBounds(Vector2(-1, 1), Vector2(1, -1)));
			assert(v.outOfBounds(Vector2(1, 1), Vector2(2, -1)));
		});
	});
	
	describe("ZERO", function() {
		it("is the zero vector", function() {
			var v = Vector2.ZERO;
			assert.equal(v.x, 0);
			assert.equal(v.y, 0);
		});
	});
	
	describe("UNIT_X", function() {
		it("is a unit vector along the positive x-axis", function() {
			var v = Vector2.UNIT_X;
			assert.equal(v.x, 1);
			assert.equal(v.y, 0);
		});
	});
	
	describe("UNIT_Y", function() {
		it("is a unit vector along the positive y-axis", function() {
			var v = Vector2.UNIT_Y;
			assert.equal(v.x, 0);
			assert.equal(v.y, 1);
		});
	});
});