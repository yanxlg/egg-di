"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_execute_context_1 = require("./route-execute-context");
class Factory {
    constructor(app) {
        this.app = app;
        this.scanner = new route_execute_context_1.default(this.app);
    }
}
exports.default = Factory;
