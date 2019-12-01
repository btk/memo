import * as JsStore from 'jsstore';
import { IDataBase, DATA_TYPE, ITable } from 'jsstore';
import * as JsStoreWorker from "jsstore/dist/jsstore.worker.commonjs2";
window['JsStoreWorker'] = JsStoreWorker;

const connection = new JsStore.Instance();
const DB_NAME ='memo_db';

class LocalDB {

  initDB(){
    try {
      const dataBase = this.getDataBaseSchema();
      return connection.initDb(dataBase);
    }
    catch (ex) {
      console.error(ex);
    }
  }

  getConnection(){
    return connection;
  }

  async insert(table, value){
    let noOfDataInserted = await connection.insert({
      into: table,
      values: [value]
    });

    if(noOfDataInserted > 0) {
      console.log(value);
      return true;
    }
  }

  async select(table, where, order, limit){
    let query = {
        from: table
    };
    if(where){
      query.where = where;
    }
    if(limit){
      query.limit = limit;
    }
    if(order){
      query.order = order;
    }
    let results = await connection.select(query);

    return results;
  }

  async delete(table, where, limit){
    let query = {
      from: table,
      where
    };

    if(limit){
      query.limit = limit;
    }

    let rowsDeleted = await connection.remove(query);
    return rowsDeleted;
  }

  async update(table, where, set, limit){
    let rowsUpdated = await connection.update({
        in: table,
        where,
        set,
        limit
    });

    return rowsUpdated;
  }

  async truncate(){
    let sheetsDeleted = await connection.remove({
      from: "sheet"
    });

    let linesDeleted = await connection.remove({
      from: "line"
    });

    return { sheetsDeleted, linesDeleted };
  }

  getDataBaseSchema() {
    const sheet = {
      name: 'sheet',
      columns: {
          id: { primaryKey: true, autoIncrement: true },
          title:  { notNull: false, dataType: "string" },
          active:  { notNull: true, dataType: "number" },
          created_at: { notNull: true, dataType: "number" },
          accessed_at: { notNull: true, dataType: "number" }
      }
    };
    const line = {
      name: 'line',
      columns: {
          id: { primaryKey: true, autoIncrement: true },
          sheet_id:  { notNull: true, dataType: "number" },
          line_key:  { notNull: true, dataType: "string" },
          date: { notNull: true, dataType: "string" },
          text: { notNull: false, dataType: "string" },
          pos: { notNull: true, dataType: "number" }
      }
    };
    const db = {
        name: DB_NAME,
        tables: [sheet, line]
    }
    return db;
  }

}

const _db = new LocalDB();
export default _db;
