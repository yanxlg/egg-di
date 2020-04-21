import {Application} from 'egg';
import RouteExecuteContext from './route-execute-context';

class Factory {
    private readonly app: Application;
    private scanner: RouteExecuteContext;

    constructor(app: Application) {
        this.app = app;
        this.scanner = new RouteExecuteContext(this.app);
    }
}

export default Factory;
