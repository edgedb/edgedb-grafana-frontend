import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { FieldType, QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { defaultQuery, EdgeDBDataSourceOptions, EdgeDBQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, EdgeDBQuery, EdgeDBDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, queryText: event.target.value });
    onRunQuery();
  };

  onValueTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    const valueType = FieldType[event.target.value as FieldType];
    if (valueType !== undefined) {
      onChange({ ...query, valueType: valueType });
      onRunQuery();
    }
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryText, valueType } = query;

    return (
      <div className="gf-form">
        <FormField
          width={8}
          value={valueType}
          onChange={this.onValueTypeChange}
          label="Value type"
          tooltip="One of: time, number, string, boolean, trace"
          type="string"
        />
        <FormField
          width={8}
          labelWidth={8}
          value={queryText || ''}
          onChange={this.onQueryTextChange}
          label="Query Text"
          tooltip="EdgeQL"
          type="string"
        />
      </div>
    );
  }
}
