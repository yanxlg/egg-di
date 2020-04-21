"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
const medata_scanner_1 = require("./medata-scanner");
const constants_1 = require("../constants");
const shared_utils_1 = require("../utils/shared.utils");
const unknown_request_mapping_exception_1 = require("../errors/exceptions/unknown-request-mapping.exception");
const fs = require("fs");
const enums_1 = require("../enums");
class ControllerScanner extends medata_scanner_1.default {
    create() {
        const dir = path.resolve(); // 项目根目录
        const dirPath = path.join(dir, enums_1.ControlDir);
        const files = fs_1.readdirSync(dirPath);
        let list = [];
        files.map((file) => {
            let fPath = path.join(dirPath, file);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) {
                throw '文件夹嵌套后续处理';
            }
            // TODO 需要做更多兼容
            const fileName = file.replace(/\.(js|ts)/, '');
            if (stats.isFile()) {
                const controllerClass = require(dir + '/app/controller/' + file).default;
                const { path } = this.exploreControllerMetadata(controllerClass);
                if (path) {
                    list.push({
                        fileName: fileName,
                        controllerClass: controllerClass,
                        prefix: path,
                        methods: this.scanForPaths(controllerClass.prototype),
                    });
                }
            }
        });
        return list;
    }
    exploreControllerMetadata(controllerClass) {
        return {
            path: Reflect.getMetadata(constants_1.PATH_METADATA, controllerClass),
            host: Reflect.getMetadata(constants_1.HOST_METADATA, controllerClass),
            options: Reflect.getMetadata(constants_1.SCOPE_OPTIONS_METADATA, controllerClass),
        };
    }
    exploreMethodMetadata(prototype, methodName) {
        const targetCallback = prototype[methodName];
        const routePath = Reflect.getMetadata(constants_1.PATH_METADATA, targetCallback);
        if (shared_utils_1.isUndefined(routePath)) {
            return null;
        }
        const requestMethod = Reflect.getMetadata(constants_1.METHOD_METADATA, targetCallback);
        const path = shared_utils_1.isString(routePath)
            ? [this.validateRoutePath(routePath)]
            : routePath.map((p) => this.validateRoutePath(p));
        return {
            path,
            requestMethod,
            targetCallback,
            methodName,
        };
    }
    validateRoutePath(path) {
        if (shared_utils_1.isUndefined(path)) {
            throw new unknown_request_mapping_exception_1.UnknownRequestMappingException();
        }
        return shared_utils_1.validatePath(path);
    }
    scanForPaths(prototype) {
        return this.scanFromPrototype(prototype, (method) => this.exploreMethodMetadata(prototype, method));
    }
}
exports.default = ControllerScanner;
