"use strict"


/**
 * 
 * @param {Number} row  
 * @param {Number} col 
 * @returns {Number[][]}
 */
function createEmptyMatrix(row, col) {
    var I = [];
    for (var $row = 0; $row < row; $row++) {
        I[$row] = [];
        for (var $col = 0; $col < col; $col++) {
            I[$row][$col] = 0;
        }
    }
    return I;
}


/**
 * 
 * @param {Number[][]} matrix 
 * @param {Number} srow 
 * @param {Number} scol 
 * @returns {Number[][]}
 */
function cofactor(matrix, srow, scol) {
    var C = []; //the cofactor
    if (matrix.length == 1) {
        return [[A[0][0]]];
    } else {
        for (var row = 0; row < matrix.length; row++) {
            if (row == srow) { continue; }
            var tempRow = [];
            for (var col = 0; col < matrix[0].length; col++) {
                if (col == scol) { continue; }
                else {
                    tempRow.push(matrix[row][col]);
                }
            }
            C.push(tempRow);
        }
    }
    return C;
}


/**
 * calculate matrix determinant
 * @param {Number[][]} matrix 
 * @returns {Number}
 */
function det(matrix) {
    var result = 0,
        row = 0;
    if (matrix.length == 1) {
        return matrix[0][0];
    } else {
        for (var col = 0; col < matrix[0].length; col++) {
            result += matrix[row][col] * Math.pow(-1, row + col) * det(cofactor(matrix, row, col));
        }
        return result;
    }
}


/**
 * 
 * @param {Number[][]} matrix 
 * @param {Number} vector 
 * @returns {Number[][]}
 */
function vectorDivide(matrix, vector) {
    var T = [];
    for (var row = 0; row < matrix.length; row++) {
        T[row] = [];
        for (var col = 0; col < matrix[0].length; col++) {
            T[row][col] = matrix[row][col] / vector;
        }
    }
    return T;
}


/**
 * 
 * @param {Number[][]} matrix 
 * @returns {Number[][]}
 */
function transpose(matrix) {
    var T = createEmptyMatrix(matrix[0].length, matrix.length);
    for (var row = 0; row < matrix.length; row++) {
        for (var col = 0; col < matrix[0].length; col++) {
            T[col][row] = matrix[row][col]
        }
    }
    return T;
}


/**
 * 
 * @param {Number[][]} matrixA 
 * @param {Number[][]} matrixB 
 * @returns {Number[][]}
 */
function multiply(matrixA, matrixB) {
    var T = createEmptyMatrix(matrixA.length, matrixB[0].length);
    for (var row = 0; row < matrixA.length; row++) {
        for (var col = 0; col < matrixB[0].length; col++) {
            var k = 0;
            while (k < matrixB.length) {
                T[row][col] += matrixA[row][k] * matrixB[k][col];
                k++;
            }
        }
    }
    return T;
}


/**
 * 
 * @param {Number[][]} matrix 
 * @returns {Number[][]}
 */
function adjoint(matrix) {
    var Aj = [];
    if (matrix.length == 1) {
        return [[1]];
    }
    for (var row = 0; row < matrix.length; row++) {
        var tempRow = [];
        for (var col = 0; col < matrix[0].length; col++) {
            tempRow.push(det(cofactor(matrix, row, col)) * Math.pow(-1, row + col));
        }
        Aj.push(tempRow);
    }
    return transpose(Aj);
}


/**
 * 
 * @param {Number[][]} matrix 
 * @returns {Number[][]}
 */
function invert(matrix) {
    return vectorDivide(adjoint(matrix), det(matrix));
}