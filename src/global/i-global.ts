export interface IGlobal<T> {
    active: Array<T>;
    init(): Promise<Array<T>>;
}