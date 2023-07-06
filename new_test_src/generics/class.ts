import MyDaoInterface from "./interface";

export default class MyDao<T> implements MyDaoInterface<T> {

    tableName = '';

    insert(object: T): boolean {
        return true;
    }

    get(id: number): T {
        // get logic
        return Object();
    }

    getAll(): [T] {
        // getAll logic
        return Object();
    }
}
