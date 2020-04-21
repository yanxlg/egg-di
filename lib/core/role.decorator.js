"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const set_metadata_decorator_1 = require("./set-metadata.decorator");
const constants_1 = require("../constants");
exports.Roles = (...roles) => set_metadata_decorator_1.SetMetadata(constants_1.ROLES_METADATA, roles);
