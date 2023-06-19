export default interface MyDaoInterface<T> {

    tableName: string;

    insert(object: T): boolean;

    get(id: number): T;

    getAll(): [T];
}
