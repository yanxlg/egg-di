import { Application } from 'egg';
declare class Factory {
    private readonly app;
    private scanner;
    constructor(app: Application);
}
export default Factory;
