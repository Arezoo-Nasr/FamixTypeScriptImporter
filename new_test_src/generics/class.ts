import MyDaoInterface from "./interface";

class MyDao<T> implements MyDaoInterface<T> {

    tableName = '';

    insert(object: T): boolean {
        return true;
    }

    get(id: number): T {
        return Object();
    }

    getAll(): [T] {
        return Object();
    }
}
