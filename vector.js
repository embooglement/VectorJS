(function(exports) {
	"use strict";
	
	/* ===== Utilities ===== */
	
	function defaultValue(value, default_value) {
		return typeof value != "undefined" ? value : default_value;
	}

	function extend(object) {
		if (arguments.length < 2) {
			return object;
		}

		for (var i = 1; i < arguments.length; ++i) {
			var argument = arguments[i];

			if (typeof argument != "object" || argument === object) {
				continue;
			}

			for (var key in argument) {
				if (argument.hasOwnProperty(key)) {
					object[key] = argument[key];
				}
			}
		}

		return object;
	}
	
	function isArray(value) {
		if (Array.isArray) {
			return Array.isArray(value);
		} else {
			return Object.prototype.toString.call(value) == "[object Array]";
		}
	}

	/* ===== Vector2 ===== */
	
	function Vector2(x, y) {
		if (!(this instanceof Vector2)) {
			return new Vector2(x, y);
		}
	
		this.x = defaultValue(x, 0);
		this.y = defaultValue(y, 0);
	}
	
	extend(Vector2.prototype, {
		clone: function() {
			return Vector2(this.x, this.y);
		},
		toString: function() {
			return "[" + this.x + ", " + this.y + "]";
		},
		toArray: function() {
			return [this.x, this.y];
		},
	
		length: function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},
		direction: function() {
			if (this.x == 0 && this.y == 0) {
				throw new RangeError();
			}
			
			if (!isFinite(this.x) || !isFinite(this.y)) {
				throw new RangeError();
			}
			
			if (isNaN(this.x) || isNaN(this.y)) {
				throw new RangeError();
			}
			
			return Math.atan2(this.y, this.x);
		},
	
		negate: function() {
			return Vector2(-this.x, -this.y);
		},
		add: function(v2) {
			return Vector2(this.x + v2.x, this.y + v2.y);
		},
		subtract: function(v2) {
			return this.add(v2.negate());
		},
		multiply: function(scalar) {
			return Vector2(this.x * scalar, this.y * scalar);
		},
		divide: function(scalar) {
			return this.multiply(1 / scalar);
		},
		dot: function(v2) {
			return this.x * v2.x + this.y * v2.y;
		},
		transform: function(matrix) {
			return matrix.multiply(this);
		},
		normalize: function() {
			return this.divide(this.length());
		},
	
		equals: function(v2) {
			return this.x == v2.x && this.y == v2.y;	
		},
		outOfBounds: function(top_left, bottom_right) {
			return this.x < top_left.x || this.y > top_left.y || this.x >= bottom_right.x || this.y <= bottom_right.y;
		}
	});
	
	extend(Vector2, {
		ZERO: Vector2(0, 0),
		UNIT_X: Vector2(1, 0), 
		UNIT_Y: Vector2(0, 1)
	});
	
	/* ===== Vector3 ===== */
	
	function Vector3(x, y, z) {
		if (!(this instanceof Vector3)) {
			return new Vector3(x, y, z);
		}
	
		this.x = defaultValue(x, 0);
		this.y = defaultValue(y, 0);
		this.z = defaultValue(z, 0);
	}
	
	extend(Vector3.prototype, {
		clone: function() {
			return Vector3(this.x, this.y, this.z);
		},
		toString: function() {
			return "[" + this.x + ", " + this.y + ", " + this.z + "]";
		},
		toArray: function() {
			return [this.x, this.y, this.z];
		},
	
		length: function() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		},
	
		negate: function() {
			return Vector3(-this.x, -this.y, -this.z);
		},
		add: function(v2) {
			return Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
		},
		subtract: function(v2) {
			return this.add(v2.negate());
		},
		multiply: function(scalar) {
			return Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
		},
		divide: function(scalar) {
			return this.multiply(1 / scalar);
		},
		dot: function(v2) {
			return this.x * v2.x + this.y * v2.y + this.z * v2.z;
		},
		cross: function(v2) {
			return Vector3(
				this.y * v2.z - this.z * v2.y,
				this.x * v2.z - this.z * v2.x,
				this.x * v2.y - this.y * v2.x
			);
		},
		normalize: function() {
			return this.divide(this.length());
		},
	
		equals: function(v2) {
			return this.x == v2.x && this.y == v2.y && this.z == v2.z;
		}
	});
	
	extend(Vector3, { 
		ZERO: Vector3(0, 0, 0),
		UNIT_X: Vector3(1, 0, 0),
		UNIT_Y: Vector3(0, 1, 0),
		UNIT_Z: Vector3(0, 0, 1)
	});
	
	/* ===== Matrix3 ===== */
	
	function Matrix3(matrix) {
		if (!(this instanceof Matrix3)) {
			return new Matrix3(matrix);
		}

		this._matrix = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
	
		if (typeof matrix == "undefined") {
			return;
		}
		
		if (!isArray(matrix)) {
			throw new TypeError();
		}
		
		if (matrix.length != 3) {
			throw new TypeError();
		}
	
		for (var j = 0; j < 3; ++j) {
			var row = matrix[j];
			
			if (!isArray(row)) {
				throw new TypeError();
			}
			
			if (row.length != 3) {
				throw new TypeError();
			}
			
			for (var i = 0; i < 3; ++i) {
				this._matrix[j][i] = row[i];
			}
		}
	}
	
	extend(Matrix3.prototype, {
		_mapFromRows: function(func) {
			return Matrix3([0, 1, 2].map((function(i) {
				return func(this.getRow(i), i).toArray();
			}).bind(this)));
		},
	
		clone: function() {
			return Matrix3(this.toMatrixArray());
		},
		toString: function() {
			return "[" + this.getRow(0) + ", " + this.getRow(1) + ", " + this.getRow(2) + "]";
		},
		toMatrixArray: function() {
			return [this.getRow(0).toArray(), this.getRow(1).toArray(), this.getRow(2).toArray()];
		},
		toArray: function() {
			return this.toMatrixArray().reduce(function(a, b) {
				return a.concat(b);
			});
		},
	
		get: function(i, j) {
			return this._matrix[j][i];
		},
		set: function(i, j, v) {
			this._matrix[j][i] = v;	
		},
	
		negate: function() {
			return this._mapFromRows(function(row) {
				return row.negate();
			});
		},
		add: function(m2) {
			return this._mapFromRows(function(row, i) {
				return row.add(m2.getRow(i));
			});
		},
		subtract: function(m2) {
			return this.add(m2.negate());
		},
		multiply: function(m2) {
			if (typeof m2 == "number") {
				return this._mapFromRows(function(row, i) {
					return row.multiply(m2);
				});
			} else if (m2 instanceof Number) {
				return this.multiply(m2.valueOf());
			} else if (m2 instanceof Vector2) {
				var x = this.get(0, 0) * m2.x + this.get(1, 0) * m2.y + this.get(2, 0);
				var y = this.get(0, 1) * m2.x + this.get(1, 1) * m2.y + this.get(2, 1);
				return Vector2(x, y);
			} else if (m2 instanceof Matrix3) {
				return this._mapFromRows(function(row) {
					return Vector3(row.dot(m2.getColumn(0)), row.dot(m2.getColumn(1)), row.dot(m2.getColumn(2)));
				});
			} else {
				throw new TypeError();
			} 
		},
		divide: function(scalar) {
			return this.multiply(1 / scalar);
		},
	
		inverse: function() {
			var det = this.determinant();
			
			if (det == 0) {
				return Matrix3.NaN;
			}
			
			var transpose = this.transpose();
			var g = transpose.get.bind(transpose);
			var cofactor = function(i, j) {
				var x1 = (i + 1) % 3;
				var x2 = (i + 2) % 3;
				var y1 = (j + 1) % 3;
				var y2 = (j + 2) % 3;
				
				return g(x1, y1) * g(x2, y2) - g(x1, y2) * g(x2, y1);
			};
			
			var adjoint = Matrix3();	
			for (var j = 0; j < 3; ++j) {
				for (var i = 0; i < 3; ++i) {
					adjoint.set(i, j, cofactor(i, j)); 		
				}	
			}		
				
			return adjoint.divide(det);
		},
		transpose: function() {
			return Matrix3([
				this.getColumn(0).toArray(),
				this.getColumn(1).toArray(),
				this.getColumn(2).toArray()
			]);
		},
		determinant: function() {
			var g = this.get.bind(this);			
			return (
				  g(0, 0) * (g(1, 1) * g(2, 2) - g(2, 1) * g(1, 2))
				- g(1, 0) * (g(0, 1) * g(2, 2) - g(2, 1) * g(0, 2))
				+ g(2, 0) * (g(0, 1) * g(1, 2) - g(1, 1) * g(0, 2))
			);
		},
	
		getColumn: function(i) {
			var m = this._matrix;
			return Vector3(m[0][i], m[1][i], m[2][i]);
		},
		getRow: function(j) {
			var m = this._matrix[j];
			return Vector3(m[0], m[1], m[2]);
		},
		
		equals: function(m2) {
			for (var j = 0; j < 3; ++j) {
				for (var i = 0; i < 3; ++i) { 
					if (this.get(i, j) != m2.get(i, j)) {
						return false;
					}
				}
			}
			
			return true;
		},
		isNaN: function() {
			for (var j = 0; j < 3; ++j) {
				for (var i = 0; i < 3; ++i) {
					if (!isNaN(this.get(i, j))) {
						return false;
					}
				}
			}
			
			return true;
		}
	});
	
	extend(Matrix3, {
		IDENTITY: Matrix3(),
		ZERO: Matrix3([[0, 0, 0], [0, 0, 0], [0, 0, 0]]),
		NaN: Matrix3([[NaN, NaN, NaN], [NaN, NaN, NaN], [NaN, NaN, NaN]]),
	
		translate: function(x, y) {
			if (x instanceof Vector2) {
				return Matrix3.translate(x.x, x.y);
			}
	
			return Matrix3([
				[1, 0, x],
				[0, 1, y],
				[0, 0, 1]
			]);
		},
		rotate: function(angle) {
			return Matrix3([
				[Math.cos(angle), -Math.sin(angle), 0],
				[Math.sin(angle), Math.cos(angle), 0],
				[0, 0, 1]
			]);
		},
		scale: function(factor_x, factor_y) {
			if (factor_x instanceof Vector2) {
				return Matrix3.scale(factor_x.x, factor_x.y);
			}
	
			factor_y = defaultValue(factor_y, factor_x);
	
			return Matrix3([
				[factor_x, 0, 0],
				[0, factor_y, 0],
				[0, 0, 1]
			]);
		}
	});
	
	extend(exports, {
		Vector2: Vector2,
		Vector3: Vector3,
		Matrix3: Matrix3
	});
}(typeof window != "undefined" ? window : module.exports));
