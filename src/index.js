"use strict";
exports.__esModule = true;
exports.sum = function (a, b) {
    if ('development' === process.env.NODE_ENV) {
        console.log('boop');
    }
    return a + b;
};
