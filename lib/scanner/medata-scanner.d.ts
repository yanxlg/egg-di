export declare class MetadataScanner {
    scanFromPrototype<R = any>(prototype: object, callback: (name: string) => R): R[];
    getAllFilteredMethodNames(prototype: object): IterableIterator<string>;
}
export default MetadataScanner;
