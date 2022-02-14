import React, { Component } from 'react';
import { VictoryChart, VictoryArea, VictoryTheme, VictoryAxis } from "victory";

import api from '../api';

export class RamMonitor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        TOTAL: 0,
        FREE: 0,
        CONSUMIDA: 0,
        PCT: 0,
        SHARED: 0
      },
      chart_data: [],
      loading: true,
      error: null,
    }
  }

  fetchData = async () => {
    try {
      const data = await api.getRam();

      let d = new Date();

      let chartAxis = {
        x: d.getMinutes() + ":" + d.getSeconds(),
        y: data.data.PCT
      }

      this.setState({ data: { ...this.state.data, ...data.data }, chart_data: [...this.state.chart_data, chartAxis] })
      
    } catch (error) {
      this.setState({ error: error });
      console.error(error);
    }
  }

  componentDidMount() {
    this.fetchData();

    this.intervalId = setInterval(this.fetchData, 5000);
  }

  componentWillUnmount() {
    //limpiamos memoria
    clearTimeout(this.timeOutId);
    // paramos el intervalo
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div className="container">
        <h1>Monitor de RAM</h1>
        <hr /><br /><br />
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <VictoryChart
              theme={VictoryTheme.material}
            >
              <VictoryArea
                style={{ data: { fill: "#c43a31" } }}
                domain={{ y: [0, 100] }}
                data={this.state.chart_data}
              />
              <VictoryAxis
                label="Tiempo mm:ss"
                style={{
                  axisLabel: { padding: 30 },
                  tickLabels: { angle: 270 }
                }}
              />
              <VictoryAxis dependentAxis
                label="% RAM"
                style={{
                  axisLabel: { padding: 40 }
                }}
              />
            </VictoryChart>
          </div>
          <div className="col-12 col-md-6">
            <div className="card text-dark bg-light mb-3">
              <div className="card-header">Monitor de sistema</div>
              <div className="card-body">
                <h5 className="card-title">DATOS MEMORIA RAM</h5>
                <p className="card-text">RAM total: {this.state.data.TOTAL}</p>
                <p className="card-text">RAM libre: {this.state.data.FREE}</p>
                <p className="card-text">RAM utilizada: {this.state.data.CONSUMIDA}</p>
                <p className="card-text">RAM % Utilizada: {this.state.data.PCT}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RamMonitor