import BasePipe,{Pipe} from "./base-pipe";


class PipesManager {
    private guardsMap = new Map<Pipe, BasePipe>();

    public get(pipe: Function | Pipe | BasePipe) {
        const isObject = (pipe as BasePipe | { [key: string]: any }).transform;
        if (isObject) {
            // pipe实例
            const classDeclaration = (pipe as BasePipe).constructor as Pipe;
            let instance = this.guardsMap.get(classDeclaration);
            if(instance){
                return instance;
            }
            instance = pipe as BasePipe;
            this.guardsMap.set(classDeclaration,instance);
            return instance;
        }else if((pipe as Pipe|any).prototype&&(pipe as Pipe|any).prototype.transform){
            // pipe类
            const classDeclaration = (pipe as Pipe);
            let instance = this.guardsMap.get(classDeclaration);
            if(instance){
                return instance;
            }
            instance = (new (classDeclaration as any)()) as BasePipe
            this.guardsMap.set(classDeclaration,instance);
            return instance;
        }else{
            return {
                transform:pipe
            }
        }
    }
}

export default PipesManager;
