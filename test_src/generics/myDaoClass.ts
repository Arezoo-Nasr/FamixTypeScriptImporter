import MyDaoInterface from "./myDaoInterface";

export default class MyDao<T> implements MyDaoInterface<T>{

    tableName: string = ''

    insert(object: T): boolean {
    console.log('insert logic')
        return true
    }
    get(id: number): T {
        //get logic
        return Object()
    }
    getAll(): [T] {
        //getAll logic
        return Object()
    }


}