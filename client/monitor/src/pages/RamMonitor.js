import React, { Component } from 'react'
import { render } from "react-dom";
import { VictoryChart, VictoryArea, VictoryTheme } from "victory";

import api from '../api';

export class RamMonitor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      chart_data: [],
      loading: true,
      error: null,
    }
  }

  fetchData = async () => {
    try {
      const data = await api.getRam();

      //console.log(data.data);

      let d = new Date();

      let chartAxis = {
        x: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
        y: data.data.usagePercentage
      }

      this.setState({data: data.data, chart_data: [...this.state.chart_data, chartAxis]})

      //console.log(this.state.data);
      console.log(this.state.chart_data);
    } catch (error) {
      this.setState({error: error});
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
        <VictoryChart
          theme={VictoryTheme.material}
        >
          <VictoryArea
            style={{ data: { fill: "#c43a31" } }}
            domain={{y: [0, 100]}}
            data={this.state.chart_data}
          />
        </VictoryChart>
      </div>
    )
  }
}

export default RamMonitor