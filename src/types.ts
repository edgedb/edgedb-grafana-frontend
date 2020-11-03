import { DataQuery, DataSourceJsonData, FieldType } from '@grafana/data';

export interface EdgeDBQuery extends DataQuery {
  queryText?: string;
  valueType: FieldType;
}

export const defaultQuery: Partial<EdgeDBQuery> = {
  queryText: 'SELECT { time := 0, value := 0 };',
  valueType: FieldType.number,
};

/**
 * These are options configured for each DataSource instance
 */
export interface EdgeDBDataSourceOptions extends DataSourceJsonData {
  uri?: string;
}
