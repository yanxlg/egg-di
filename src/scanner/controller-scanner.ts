import * as path from 'path';
import { readdirSync } from 'fs';
import MetadataScanner from './medata-scanner';
import {
    HOST_METADATA,
    METHOD_METADATA,
    PATH_METADATA,
    SCOPE_OPTIONS_METADATA,
} from '../constants';
import { isString, isUndefined, validatePath } from '../utils/shared.utils';
import { UnknownRequestMappingException } from '../errors/exceptions/unknown-request-mapping.exception';
import * as fs from 'fs';
import { ControlDir } from '../enums';
import { ControllerClass } from '../interfaces/controllers';

interface ControllerItem {
    fileName: string;
    prefix: string;
    methods: Array<{
        path: string[];
        requestMethod: string;
        targetCallback: Function;
        methodName: string;
    }>;
    controllerClass: any;
}

class ControllerScanner extends MetadataScanner {
    public create() {
        const dir = path.resolve(); // 项目根目录
        const dirPath = path.join(dir, ControlDir);
        const files = readdirSync(dirPath);
        let list: ControllerItem[] = [];

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

    private exploreControllerMetadata(controllerClass: ControllerClass) {
        return {
            path: Reflect.getMetadata(PATH_METADATA, controllerClass),
            host: Reflect.getMetadata(HOST_METADATA, controllerClass),
            options: Reflect.getMetadata(SCOPE_OPTIONS_METADATA, controllerClass),
        };
    }

    private exploreMethodMetadata(prototype: object, methodName: string) {
        const targetCallback = prototype[methodName];
        const routePath = Reflect.getMetadata(PATH_METADATA, targetCallback);
        if (isUndefined(routePath)) {
            return null;
        }
        const requestMethod = Reflect.getMetadata(METHOD_METADATA, targetCallback);
        const path = isString(routePath)
            ? [this.validateRoutePath(routePath)]
            : routePath.map((p) => this.validateRoutePath(p));

        return {
            path,
            requestMethod,
            targetCallback,
            methodName,
        };
    }

    private validateRoutePath(path: string): string {
        if (isUndefined(path)) {
            throw new UnknownRequestMappingException();
        }
        return validatePath(path);
    }

    private scanForPaths(prototype: object) {
        return this.scanFromPrototype<any>(prototype, (method) =>
            this.exploreMethodMetadata(prototype, method),
        );
    }
}

export default ControllerScanner;
