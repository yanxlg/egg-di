import BasePipe, { Pipe } from "./base-pipe";
declare class PipesManager {
    private guardsMap;
    get(pipe: Function | Pipe | BasePipe): {
        transform: Function | BasePipe | typeof BasePipe;
    };
}
export default PipesManager;
