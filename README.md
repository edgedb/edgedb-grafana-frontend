# EdgeDB Data Source Plugin for Grafana

Grafana supports a wide range of data sources, including Prometheus, MySQL, and
now also EdgeDB. 

## Getting started
1. Install dependencies
```BASH
yarn install
```
2. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
or
```BASH
yarn watch
```
3. Build plugin in production mode
```BASH
yarn build
```

4. In Grafana, go to Configuration / Data Sources and "Add data source".

5. In the plugin setup, fill out the URI with the HTTP port's endpoint
   to your database.  Grafana will test the connection on save.

## Tips for building EdgeDB queries
1. Make sure your query returns a set in the following shape:
   
   ```
   {
     Object {time: <int>, value: <value-type>},
     Object {time: <int>, value: <value-type>},
     ...
   }
   ```
   
2. Make sure the values in the `time` field are epoch milliseconds.

3. If your data source grows in time, filter your query with an expression
   like `FILTER <int64>$from <= .time AND .time <= <int64>$to`.  The
   variables `from` and `to` are provided by the Grafana plugin.

## Learn more
- [EdgeDB documentation](https://edgedb.com/docs/)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to
  help you build interfaces using Grafana Design System
- [Build a data source plugin
  tutorial](https://grafana.com/tutorials/build-a-data-source-plugin)
