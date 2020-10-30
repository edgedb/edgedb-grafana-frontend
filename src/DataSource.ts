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

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  resolution: number;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.resolution = instanceSettings.jsonData.resolution || 1000.0;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // duration of the time range, in milliseconds.
    const duration = to - from;

    // step determines how close in time (ms) the points will be to each other.
    const step = duration / this.resolution;

    // Return a constant for each query.
    const data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          // { name: 'Time', values: [from, to], type: FieldType.time },
          // { name: 'Value', values: [query.constant, query.constant], type: FieldType.number },
          { name: 'time', type: FieldType.time },
          { name: 'value', type: FieldType.number },
        ],
      });
      if (query.queryText) {
        this.doRequest(query).then(response => {
          response.data.forEach((point: any) => {
            frame.appendRow([point.time, point.value]);
          });
        });
      } else {
        for (let t = 0; t < duration; t += step) {
          frame.add({ time: from + t, value: Math.sin((2 * query.frequency * Math.PI * t) / duration) });
        }
      }
      return frame;
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }

  async doRequest(query: MyQuery) {
    const result = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: 'http://127.0.0.1:8888',
      params: query.queryText,
    });

    return result;
  }
}
