"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scanner_1 = require("./scanner");
class Factory {
    constructor(app) {
        this.app = app;
        this.scanner = new scanner_1.default(this.app);
    }
}
exports.default = Factory;
