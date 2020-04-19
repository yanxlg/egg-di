import {Application} from 'egg';
import Scanner from "./scanner";

class Factory {
    private readonly app: Application;
    private scanner: Scanner;

    constructor(app: Application) {
        this.app = app;
        this.scanner = new Scanner(this.app);
    }
}

export default Factory;
