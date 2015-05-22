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

describe("Vector3", function() {
	describe("constructor", function() {
		it("can call constructor without new", function() {
			var v = Vector3(1, 2, 3);
			assert.isDefined(v);
		});
		
		it("can call constructor with new", function() {
			var v = new Vector3(1, 2, 3);
			assert.isDefined(v);
		});
		
		it("returns an object with the given x, y, and z coordinates", function() {
			var v = Vector3(1, 2, 3);
			assert.equal(v.x, 1);
			assert.equal(v.y, 2);
			assert.equal(v.z, 3);
		});
		
		it("defaults to the zero vector", function() {
			var v = Vector3();
			assert.equal(v.x, 0);
			assert.equal(v.y, 0);
			assert.equal(v.z, 0);
		});
	});
	
	describe("clone", function() {
		it("returns a new object", function() {
			var v1 = Vector3(1, 2, 3);
			var v2 = v1.clone();
			assert.notStrictEqual(v1, v2);
		});
		
		it("returns a new object with equivalent x and y coordinates", function() {
			var v1 = Vector3(1, 2, 3);
			var v2 = v1.clone();
			assert.equal(v1.x, v2.x);
			assert.equal(v1.y, v2.y);
			assert.equal(v1.z, v2.z);
		});
	});
	
	describe("toString", function() {
		it("returns a string", function() {
			var v = Vector3(1, 2, 3);
			assert.isString(v.toString());
		});
		
		it("returns a string formatted like an array", function() {
			var v = Vector3(1, 2, 3);
			assert.equal(v.toString(), "[1, 2, 3]");
		});
	});
	
	describe("toArray", function() {
		it("returns an array", function() {
			var v = Vector3(1, 2, 3);
			assert.isArray(v.toArray());
		});
		
		it("returns an array with x, y, and z as the values", function() {
			var v = Vector3(1, 2, 3);
			var a = v.toArray();
			assert.deepEqual(a, [1, 2, 3]);
		});
	});
	
	describe("length", function() {
		it("returns the magnitude of the vector", function() {
			var v1 = Vector3(0, 0, 0);
			assert.equal(v1.length(), 0);
			
			var v2 = Vector3(1, 0, 0);
			assert.equal(v2.length(), 1);
			
			var v3 = Vector3(1, 1, 0);
			assert.closeTo(v3.length(), Math.sqrt(2), FLOATING_POINT_ERROR); 
		});
	});
	
	describe("negate", function() {
		it("negates both fields", function() {
			var v1 = Vector3(1, 1, 1);
			var v2 = v1.negate();
			
			assert.equal(v2.x, -1);
			assert.equal(v2.y, -1);
			assert.equal(v2.z, -1);
		});
	});
	
	describe("add", function() {
		it("returns the vector sum", function() {
			var v1 = Vector3(1, 1, 1);
			var v2 = Vector3(2, 3, 4);
			var sum = v1.add(v2);
			
			assert.equal(sum.x, 3);
			assert.equal(sum.y, 4);
			assert.equal(sum.z, 5);
		});
		
		it("is commutative", function() {
			var v1 = Vector3(1, 2, 1);
			var v2 = Vector3(2, 3, 1);
			var sum1 = v1.add(v2);
			var sum2 = v2.add(v1);
			
			assert.closeTo(sum1.x, sum2.x, FLOATING_POINT_ERROR);
			assert.closeTo(sum1.y, sum2.y, FLOATING_POINT_ERROR);
			assert.closeTo(sum1.z, sum2.z, FLOATING_POINT_ERROR);
		});
		
		it("is assosciative", function() {
			var v1 = Vector3(1, 2, 1);
			var v2 = Vector3(2, 3, 1);
			var v3 = Vector3(3, 4, 1);
			
			var sum1 = (v1.add(v2)).add(v3);
			var sum2 = v1.add(v2.add(v3));
			
			assert.closeTo(sum1.x, sum2.x, FLOATING_POINT_ERROR);
			assert.closeTo(sum1.y, sum2.y, FLOATING_POINT_ERROR);
			assert.closeTo(sum1.z, sum2.z, FLOATING_POINT_ERROR);
		});
	});
	
	describe("subtract", function() {		
		it("returns the vector difference", function() {
			var v1 = Vector3(1, 1, 1);
			var v2 = Vector3(2, 3, 1);
			var diff = v1.subtract(v2);
			
			assert.equal(diff.x, -1);
			assert.equal(diff.y, -2);
			assert.equal(diff.z, 0);
		});
	});
	
	describe("multiply", function() {
		it("returns the scalar multiple of the vector", function() {
			var v = Vector3(1, 2, 3);
			var prod = v.multiply(3);
			
			assert.equal(prod.x, 3);
			assert.equal(prod.y, 6);
			assert.equal(prod.z, 9);
		});
		
		it("is assosciative", function() {
			var v = Vector3(1, 2, 3);
			var prod1 = v.multiply(3).multiply(4);
			var prod2 = v.multiply(3 * 4);
			
			assert.closeTo(prod1.x, prod2.x, FLOATING_POINT_ERROR);
			assert.closeTo(prod1.y, prod2.y, FLOATING_POINT_ERROR);
			assert.closeTo(prod1.z, prod2.z, FLOATING_POINT_ERROR);
		});	
	});
	
	describe("divide", function() {
		it("returns the scalar dividend of the vector", function() {
			var v = Vector3(3, 6, 9);
			var div = v.divide(3);
			
			assert.equal(div.x, 1);
			assert.equal(div.y, 2);
			assert.equal(div.z, 3);
		});
	});
	
	describe("dot", function() {
		it("returns a number", function() {
			var v1 = Vector3(1, 1, 1);
			var v2 = Vector3(3, 4, 5);
			assert.isNumber(v1.dot(v2));
		});
		
		it("returns the dot product", function() {
			var v1 = Vector3(1, 1, 0);
			var v2 = Vector3(2, 3, 0);
			var v3 = Vector3(0, 0, 0);
			var v4 = Vector3(-1, -3, 0);
			
			assert.closeTo(v1.dot(v2), 5, FLOATING_POINT_ERROR);
			assert.closeTo(v1.dot(v3), 0, FLOATING_POINT_ERROR);
			assert.closeTo(v2.dot(v3), 0, FLOATING_POINT_ERROR);
			assert.closeTo(v1.dot(v4), -4, FLOATING_POINT_ERROR);
			assert.closeTo(v2.dot(v4), -11, FLOATING_POINT_ERROR);
		});
		
		it("is commutative", function() {
			var v1 = Vector3(2, 3, 1);
			var v2 = Vector3(-1, -2, 1);
			var prod1 = v1.dot(v2);
			var prod2 = v2.dot(v1);
			
			assert.closeTo(prod1, prod2, FLOATING_POINT_ERROR);
		});
	});
	
	describe("cross", function() {
		it("returns a Vector3", function() {
			var v1 = Vector3(1, 1, 1);
			var v2 = Vector3(3, 4, 5);
			assert.instanceOf(v1.cross(v2), Vector3);
		});
		
		it("returns the cross product", function() {			
			var v1 = Vector3(1, 1, 1);
			var v2 = Vector3(2, 3, 4);
			var prod = v1.cross(v2);
						
			assert.closeTo(prod.x, 1, FLOATING_POINT_ERROR);
			assert.closeTo(prod.y, 2, FLOATING_POINT_ERROR);
			assert.closeTo(prod.z, 1, FLOATING_POINT_ERROR);
		});
		
		it("is anti-commutative", function() {
			var v1 = Vector3(2, 3, 1);
			var v2 = Vector3(-1, -2, 1);
			var prod1 = v1.cross(v2);
			var prod2 = v2.cross(v1).negate();
			
			assert.closeTo(prod1.x, prod2.x, FLOATING_POINT_ERROR);
			assert.closeTo(prod1.y, prod2.y, FLOATING_POINT_ERROR);
			assert.closeTo(prod1.z, prod2.z, FLOATING_POINT_ERROR);
		});
	});

	describe("normalize", function() {
		it("returns a unit vector in the same direction", function() {
			var v = Vector3(1, 1, 1);
			var len = v.length();
			var norm = v.normalize();
			
			assert.closeTo(norm.length(), 1, FLOATING_POINT_ERROR);
			assert.closeTo(norm.x, v.x / len, FLOATING_POINT_ERROR);
			assert.closeTo(norm.y, v.y / len, FLOATING_POINT_ERROR);
			assert.closeTo(norm.z, v.z / len, FLOATING_POINT_ERROR);
		});
	});
	
	describe("equals", function() {		
		it("returns a boolean", function() {
			var v1 = Vector3(1, 1, 1);
			var v2 = Vector3(1, 1, 1);
			
			assert.isBoolean(v1.equals(v2));
		});
		
		it("compares each field for equality", function() {
			var v1 = Vector3(1, 1, 1);
			var v2 = Vector3(1, 1, 1);
			var v3 = Vector3(2, 3, 4);
			
			assert(v1.equals(v2));
			assert(!v1.equals(v3));
		});
	});
	
	describe("ZERO", function() {
		it("is the zero vector", function() {
			var v = Vector3.ZERO;
			assert.equal(v.x, 0);
			assert.equal(v.y, 0);
			assert.equal(v.z, 0);
		});
	});
	
	describe("UNIT_X", function() {
		it("is a unit vector along the positive x-axis", function() {
			var v = Vector3.UNIT_X;
			assert.equal(v.x, 1);
			assert.equal(v.y, 0);
			assert.equal(v.z, 0);
		});
	});
	
	describe("UNIT_Y", function() {
		it("is a unit vector along the positive y-axis", function() {
			var v = Vector3.UNIT_Y;
			assert.equal(v.x, 0);
			assert.equal(v.y, 1);
			assert.equal(v.z, 0);
		});
	});
	
	describe("UNIT_Z", function() {
		it("is a unit vector along the positive z-axis", function() {
			var v = Vector3.UNIT_Z;
			assert.equal(v.x, 0);
			assert.equal(v.y, 0);
			assert.equal(v.z, 1);
		});
	});
});