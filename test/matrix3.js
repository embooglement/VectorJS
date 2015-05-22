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

function iterate_matrix(func) {
	for (var j = 0; j < 3; ++j) {
		for (var i = 0; i < 3; ++i) {
			func(i, j);
		}
	}
}

describe("Matrix3", function() {
	describe("constructor", function() {
		it("can call constructor without new", function() {
			var m = Matrix3();
			assert.isDefined(m);
		});
		
		it("can call constructor with new", function() {
			var m = new Matrix3();
			assert.isDefined(m);
		});
		
		it("defaults to the identity matrix", function() {
			var m = Matrix3();
			
			iterate_matrix(function(i, j) {
				assert.equal(m.get(i, j), (i == j ? 1 : 0));
			});
		});
		
		it("can be constructed from an array of arrays", function() {
			var m = Matrix3([
				[1, 2, 3],
				[2, 4, 6],
				[3, 6, 9]
			]);
			
			iterate_matrix(function(i, j) {
				var entry_value = (i + 1) * (j + 1);
				assert.equal(m.get(i, j), entry_value);
			});
		});
				
		it("throws for invalid arguments", function() {
			var invalid_args = [
				"hello world",
				1,
				[1, 2, 3],
				[[1, 0, 0], 1, [1, 1, 1]],
				[[1, 1, 1, 1], [1, 1, 1], [1, 1, 1]],
				[Vector3(1, 1, 1), Vector3(1, 1, 1), Vector3(1, 1, 1)]
			];
			
			for (var i = 0; i < invalid_args.length; ++i) {
				var invalid_arg = invalid_args[i];
				assert.throws(function() {
					var m = Matrix3(invalid_arg);
				}, TypeError);
			}
		});
	});
	
	describe("clone", function() {
		it("returns a new object", function() {
			var m1 = Matrix3([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
			var m2 = m1.clone();
			assert.notStrictEqual(m1, m2);
		});
		
		it("returns a new object with equivalent entries", function() {
			var m1 = Matrix3([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
			var m2 = m1.clone();
			
			iterate_matrix(function(i, j) {
				assert.equal(m1.get(i, j), m2.get(i, j));
			});
		});
	});
	
	describe("toString", function() {
		it("returns a string", function() {
			var m = Matrix3([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
			assert.isString(m.toString());
		});
		
		it("returns a string formatted like an array", function() {
			var m = Matrix3();
			assert.equal(m.toString(), "[[1, 0, 0], [0, 1, 0], [0, 0, 1]]");
		});
	});
	
	describe("toMatrixArray", function() {
		it("returns an array of arrays", function() {
			var m = Matrix3();
			var a = m.toMatrixArray();
			assert.isArray(a);
			
			for (var i = 0; i < a.length; ++i) {
				assert.isArray(a[i]);
			}
		});
		
		it("returns the an array of the same values as it was constructed with", function() {
			var m = Matrix3([
				[1, 2, 3], 
				[2, 4, 6], 
				[3, 6, 9]
			]);
			
			var a = m.toMatrixArray();
			
			iterate_matrix(function(i, j) {
				assert.equal(a[i][j], (i + 1) * (j + 1));
			});
		});
	});
	
	describe("toArray", function() {
		it("returns a flattened array of numbers", function() {
			var m = Matrix3();
			var a = m.toArray();
			assert.isArray(a);
			
			for (var i = 0; i < a.length; ++i) {
				assert.isNumber(a[i]);
			}
		});
		
		it("returns an array with all the rows concatenated", function() {
			var m = Matrix3([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9]
			]);
			
			var a = m.toArray();
			assert.deepEqual(a, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
		});
	});
	
	describe("get", function() {
		it("returns a number", function() {
			var m = Matrix3();
			assert.isNumber(m.get(0, 0));
		});
		
		it("returns the value in the ith column and jth row", function() {
			var m = Matrix3([
				[1, 2, 3],
				[4, 5, 6], 
				[7, 8, 9]
			]);
			
			iterate_matrix(function(i, j) {
				var value = m.get(i, j);
				var expected = 1 + i + 3 * j;
				assert.equal(value, expected);
			});
		})
	});
	
	describe("set", function() {
		it("sets the value for the ith row and jth column", function(){
			var m = Matrix3();
			
			m.set(0, 0, 2);
			assert.equal(m.get(0, 0), 2);
			
			m.set(1, 2, 3);
			assert.equal(m.get(1, 2), 3);
		});
	});
	
	describe("negate", function() {		
		it("negates all entries", function() {
			var m1 = Matrix3([[1, 1, 1], [2, 3, 4], [5, 6, 7]]);
			var m2 = m1.negate();
			
			iterate_matrix(function(i, j) {
				assert.equal(m1.get(i, j), -m2.get(i, j));
			});
		});
	});
	
	describe("add", function() {		
		it("returns the matrix sum", function() {
			var m1 = Matrix3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
			var m2 = Matrix3([[2, 3, 5], [7, 11, 13], [17, 19, 23]]);
			var sum = m1.add(m2);
			
			iterate_matrix(function(i, j) {
				assert.equal(sum.get(i, j), m1.get(i, j) + m2.get(i, j));
			});
		});
		
		it("is commutative", function() {
			var m1 = Matrix3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
			var m2 = Matrix3([[2, 3, 5], [7, 11, 13], [17, 19, 23]]);
			var sum1 = m1.add(m2);
			var sum2 = m2.add(m1);
			
			iterate_matrix(function(i, j) {
				assert.closeTo(sum1.get(i, j), sum2.get(i, j), FLOATING_POINT_ERROR);
			});
		});
		
		it("is assosciative", function() {
			var m1 = Matrix3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
			var m2 = Matrix3([[2, 3, 5], [7, 11, 13], [17, 19, 23]]);
			var m3 = Matrix3([[2, 4, 6], [6, 4, 2], [0, -3, 4]]);
			var sum1 = (m1.add(m2)).add(m3);
			var sum2 = m1.add(m2.add(m3));
			
			iterate_matrix(function(i, j) {
				assert.closeTo(sum1.get(i, j), sum2.get(i, j), FLOATING_POINT_ERROR);
			});
		});
	});
	
	describe("subtract", function() {
		it("returns the matrix difference", function() {
			var m1 = Matrix3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
			var m2 = Matrix3([[2, 3, 5], [7, 11, 13], [17, 19, 23]]);
			var diff = m1.subtract(m2);
			
			iterate_matrix(function(i, j) {
				assert.equal(diff.get(i, j), m1.get(i, j) - m2.get(i, j));
			});
		});
	});
	
	describe("multiply", function() {		
		it("returns the scalar multiple of the matrix", function() {
			var m = Matrix3([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
			var prod = m.multiply(3);
			
			assert.instanceOf(prod, Matrix3);
			
			iterate_matrix(function(i, j) {
				var expected = 3 * (1 + i + 3 * j);
				assert.equal(prod.get(i, j), expected);
			});
		});
		
		it("returns the affine product of a Vector2", function() {
			var m = Matrix3([
				[1, 0, -3],
				[0, -1, 2],
				[0, 0, 1]
			]);
			
			var prod = m.multiply(Vector2(2, 3));
			var expected = Vector2(-1, -1);
			
			assert.instanceOf(prod, Vector2);
			
			assert.closeTo(prod.x, expected.x, FLOATING_POINT_ERROR);
			assert.closeTo(prod.y, expected.y, FLOATING_POINT_ERROR);
		});
		
		it("returns the matrix product", function() {
			var m1 = Matrix3([
				[1, 0, 0],
				[0, 2, 0],
				[1, 0, 3]
			]);
			var m2 = Matrix3([
				[1, 2, 1],
				[1, 3, 2],
				[2, 2, 1]
			]);

			var prod = m1.multiply(m2);
			var expected = Matrix3([
				[1, 2, 1],
				[2, 6, 4],
				[7, 8, 4]
			]);

			assert.instanceOf(prod, Matrix3);
			iterate_matrix(function(i, j) {
				assert.closeTo(prod.get(i, j), expected.get(i, j), FLOATING_POINT_ERROR);				
			});
		});
		
		it("is associative for matrix multiplication", function() {
			var m1 = Matrix3([
				[1, 0, 0],
				[0, 2, 0],
				[0, 0, 3]
			]);
			
			var m2 = Matrix3([
				[1, 2, 1],
				[1, 3, 2],
				[2, 2, 1]
			]);
			
			var m3 = Matrix3([
				[3, 2, 1],
				[5, 3, 1],
				[1, 1, 1]
			]);
			
			var prod1 = m1.multiply(m2).multiply(m3);
			var prod2 = m1.multiply(m2.multiply(m3));
			
			iterate_matrix(function(i, j) {
				assert.closeTo(prod1.get(i, j), prod2.get(i, j), FLOATING_POINT_ERROR);
			});
		});
		
		it("throws a TypeError when called with something other than a number, Vector2, or Matrix3", function() {
			var m = Matrix3();
			assert.throws(function() {
				m.multiply("hello world");
			}, TypeError);
		});
	});
		
	describe("divide", function() {		
		it("returns the scalar dividend of the matrix", function() {
			var m = Matrix3([
				[1, 1, 1],
				[1, 1, 1],
				[1, 1, 1]
			]);
			var div = m.divide(3);
			
			iterate_matrix(function(i, j) {
				assert.closeTo(div.get(i, j), 1 / 3, FLOATING_POINT_ERROR);
			});
		});
	});
	
	describe("inverse", function() {
		it("returns the inverse of the  original matrix", function() {
			var id = Matrix3.IDENTITY;
			var matrices = [
				Matrix3(),
				Matrix3([
					[2, 0, 0],
					[0, 2, 0],
					[0, 0, 2]
				]),
				Matrix3([
					[1, 2, 3],
					[0, 1, 2],
					[0, 0, 1]	
				]),
				Matrix3([
					[1, 0, -2],
					[0, 1, -3],
					[0, 0, 1]
				]),
				Matrix3([
					[1, 1, -1],
					[1, -1, 1],
					[1, -1, -1]
				]),
				Matrix3([
					[1, 2, 3],
					[3, 2, 1],
					[1, 1, 2]
				])
			];
			
			matrices.forEach(function(m, index) {
				var inv = m.inverse();
				var prod1 = m.multiply(inv);
				var prod2 = inv.multiply(m);
				
				iterate_matrix(function(i, j) {
					assert.closeTo(prod1.get(i, j), id.get(i, j), FLOATING_POINT_ERROR, "Matrix #" + index);
					assert.closeTo(prod2.get(i, j), id.get(i, j), FLOATING_POINT_ERROR, "Matrix #" + index);
				});
			});
		});
		
		it("returns Matrix3.NaN when the matrix is singular", function() {			
			var matrices = [
				Matrix3([
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 0]
				]),
				Matrix3([
					[1, 0, 0],
					[0, 1, 0],
					[0, 0, 0]
				]),
				Matrix3([
					[1, 0, 1],
					[0, 1, 0],
					[1, 0, 1]
				])
			];
			
			matrices.forEach(function(m, index) {
				var inv = m.inverse();
				assert(inv.isNaN(), "Matrix #" + index);	
			});
		});
	});
	
	describe("transpose", function() {		
		it("returns the transposition of the matrix", function() {
			var m1 = Matrix3([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9]
			]);
			var m2 = m1.transpose();
			
			iterate_matrix(function(i, j) {
				assert.equal(m1.get(i, j), m2.get(j, i));
			});
		});
	});
	
	describe("determinant", function() {
		it("returns a number", function() {
			var m = Matrix3();
			assert.isNumber(m.determinant());
		});
		
		it("returns the determinant", function() {
			var m1 = Matrix3()
			assert.closeTo(m1.determinant(), 1, FLOATING_POINT_ERROR);
			
			var m2 = Matrix3([
				[1, 0, 0],
				[0, 0, 1],
				[0, 1, 0]
			]);
			assert.closeTo(m2.determinant(), -1, FLOATING_POINT_ERROR);
			
			var m3 = Matrix3([
				[1, 0, 0],
				[0, 0, 0],
				[1, 0, 1]
			]);
			assert.closeTo(m3.determinant(), 0, FLOATING_POINT_ERROR);
			
			var m4 = Matrix3([
				[1, 0, 0],
				[0, 2, 0],
				[1, 0, 1]
			]);
			assert.closeTo(m4.determinant(), 2, FLOATING_POINT_ERROR);
			
			var m5 = Matrix3([
				[-1, 1, 2],
				[0, -2, 1],
				[1, -2, 1]
			]);
			assert.closeTo(m5.determinant(), 5, FLOATING_POINT_ERROR);
		});
	});
	
	describe("getColumn", function() {
		it("returns a Vector3", function() {
			var m = Matrix3();
			assert.instanceOf(m.getColumn(0), Vector3);
		});
		
		it("returns the ith column", function() {
			var m = Matrix3();
			var v = m.getColumn(0);
			
			assert.equal(v.x, 1);
			assert.equal(v.y, 0);
			assert.equal(v.z, 0);
		});
	});
	
	describe("getRow", function() {
		it("returns a Vector3", function() {
			var m = Matrix3();
			assert.instanceOf(m.getRow(0), Vector3);
		});
		
		it("returns the jth row", function() {
			var m = Matrix3();
			var v = m.getRow(0);
			
			assert.equal(v.x, 1);
			assert.equal(v.y, 0);
			assert.equal(v.z, 0);
		});
	});
	
	describe("equals", function() {		
		it("returns a boolean", function() {
			var m1 = Matrix3();
			var m2 = Matrix3();
			assert.isBoolean(m1.equals(m2));
		});
		
		it("compares each field for equality", function() {
			var m1 = Matrix3([
				[1, 1, 1],
				[2, 2, 2],
				[3, 3, 3]
			]);
			
			var m2 = Matrix3([
				[1, 1, 1],
				[2, 2, 2],
				[3, 3, 3]
			]);
			
			var m3 = Matrix3([
				[0, 1, 1],
				[2, 0, 2],
				[3, 3, 0]
			]);
			
			assert(m1.equals(m2));
			assert(!m1.equals(m3));
		});
		
		it("is commutative", function() {
			var m1 = Matrix3();
			var m2 = Matrix3();
			
			assert(m1.equals(m2));
			assert(m2.equals(m1));
		});
		
		it("is transitive", function() {
			var m1 = Matrix3();
			var m2 = Matrix3();
			var m3 = Matrix3();
			
			assert(m1.equals(m2));
			assert(m2.equals(m3));
			assert(m3.equals(m1));
			
			var m4 = Matrix3().multiply(2);
			assert(!m4.equals(m1));
			assert(!m4.equals(m2));
		});
		
		it("is reflexive", function() {
			var m = Matrix3();
			assert(m.equals(m));
		});
	});
	
	describe("isNaN", function() {		
		it("returns a boolean", function() {
			var m = Matrix3();
			assert.isBoolean(m.isNaN());
		});
		
		it("returns true for Matrix3.NaN", function() {
			var m1 = Matrix3.NaN;
			var m2 = Matrix3();
			
			assert(m1.isNaN());
			assert(!m2.isNaN());
		});
	});
	
	describe("IDENTITY", function() {
		it("is the identity matrix", function() {
			var m = Matrix3.IDENTITY;
			
			iterate_matrix(function(i, j) {
				assert.equal(m.get(i, j), (i == j) ? 1 : 0);
			});
		});
	});
	
	describe("ZERO", function() {
		it("is the zero matrix", function() {
			var m = Matrix3.ZERO;
			iterate_matrix(function(i, j) {
				assert.equal(m.get(i, j), 0);
			});
		});
	});
	
	describe("NaN", function() {
		it("is the NaN matrix", function() {
			var m = Matrix3.NaN;
			iterate_matrix(function(i, j) {
				assert(isNaN(m.get(i, j)));
			});
		});
	});
	
	describe("translate", function() {
		it("returns a translation matrix", function() {
			var m1 = Matrix3.translate(2, 3);
			var m2 = Matrix3([
				[1, 0, 2],
				[0, 1, 3],
				[0, 0, 1]
			]);
			
			assert(m1.equals(m2));
		});
		
		it("can take a Vector2", function() {
			var m1 = Matrix3.translate(Vector2(2, 3));
			var m2 = Matrix3([
				[1, 0, 2],
				[0, 1, 3],
				[0, 0, 1]
			]);
			
			assert(m1.equals(m2));
		});
	});
	
	describe("rotate", function() {
		it("returns a translation matrix", function() {
			var a = Math.PI / 4;
			
			var m1 = Matrix3.rotate(a);
			var m2 = Matrix3([
				[Math.cos(a), -Math.sin(a), 0],
				[Math.sin(a), Math.cos(a), 0],
				[0, 0, 1]
			]);
			
			iterate_matrix(function(i, j) {
				assert.closeTo(m1.get(i, j), m2.get(i, j), FLOATING_POINT_ERROR);
			});
		});
	});
	
	describe("scale", function() {
		it("returns a scaling matrix", function() {
			var m1 = Matrix3.scale(2, 3);
			var m2 = Matrix3([
				[2, 0, 0],
				[0, 3, 0],
				[0, 0, 1]
			]);
			
			assert(m1.equals(m2));
		});
		
		it("can take a single number", function() {
			var m1 = Matrix3.scale(2);
			var m2 = Matrix3([
				[2, 0, 0],
				[0, 2, 0],
				[0, 0, 1]
			]);
			
			assert(m1.equals(m2));
		});
		
		it("can take a Vector2", function() {
			var m1 = Matrix3.scale(Vector2(2, 3));
			var m2 = Matrix3([
				[2, 0, 0],
				[0, 3, 0],
				[0, 0, 1]
			]);
			
			assert(m1.equals(m2));
		});
	});
});