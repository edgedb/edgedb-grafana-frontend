import defaults from 'lodash/defaults';
import { getBackendSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { EdgeDBQuery, EdgeDBDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<EdgeDBQuery, EdgeDBDataSourceOptions> {
  uri?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<EdgeDBDataSourceOptions>) {
    super(instanceSettings);
    this.uri = instanceSettings.jsonData.uri;
  }

  async query(options: DataQueryRequest<EdgeDBQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'time', type: FieldType.time },
          { name: 'value', type: query.valueType },
        ],
      });
      if (query.queryText) {
        this.doRequest(query.queryText, from, to).then(response => {
          if (Object.keys(response.data).includes('data')) {
            const objects = response.data as { data: any[] };
            objects.data.forEach((point: any) => {
              if (point.time >= from && point.time <= to) {
                frame.appendRow([point.time, point.value]);
              }
            });
          }
        });
      }
      return frame;
    });

    return { data };
  }

  async testDatasource() {
    var result = {
      status: 'error',
      message: 'Cannot connect, check the URI in configuration',
    };
    if (this.uri) {
      const response = await this.doRequest('SELECT 1;', 0, 0);
      if (Object.keys(response.data).includes('data')) {
        const objects = response.data as { data: any[] };
        objects.data.forEach((obj: any) => {
          if (obj === 1) {
            result.status = 'success';
            result.message = 'Connected successfully!';
          }
        });
      }
    }
    return result;
  }

  async doRequest(queryText: string, from: number, to: number) {
    if (!this.uri) {
      return { data: [] };
    }

    return getBackendSrv()
      .fetch<DataQueryResponse>({
        method: 'GET',
        url: this.uri,
        params: { query: queryText, variables: JSON.stringify({ from: from, to: to }) },
      })
      .toPromise();
  }
}
