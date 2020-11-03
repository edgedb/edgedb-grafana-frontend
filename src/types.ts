import { DataQuery, DataSourceJsonData, FieldType } from '@grafana/data';

export interface EdgeDBQuery extends DataQuery {
  queryText?: string;
  valueType: FieldType;
}

export const defaultQuery: Partial<EdgeDBQuery> = {
  queryText: 'SELECT { time := <int64>$from, value := 0 } FILTER <int64>$from <= .time AND .time <= <int64>$to;',
  valueType: FieldType.number,
};

/**
 * These are options configured for each DataSource instance
 */
export interface EdgeDBDataSourceOptions extends DataSourceJsonData {
  uri?: string;
}
