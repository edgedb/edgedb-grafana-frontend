import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { EdgeDBQuery, EdgeDBDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, EdgeDBQuery, EdgeDBDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
