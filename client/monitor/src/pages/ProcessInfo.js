import React, { Component } from 'react'
import PageLoading from '../components/PageLoading';
import api from '../api';

export class ProcessInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      loading: true
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({loading: true});
    try {
      const data = await api.getProcess();
      //console.log(data.data);
      this.setState({processes: data.data, loading: false});
    } catch(error) {
      console.error(error);
    }
  }

  render() {
    if (this.state.loading === true && !this.state.data) {
      return <PageLoading />;
    }

    return (
      <div className="container">
        <h1>Monitor de Procesos</h1>
        <hr /><br /><br />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">PID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.processes.map((process, index) => {
              return (
                <React.Fragment>
                  <tr key={"padre" + process.pid+index+"p"} data-toggle="collapse" data-target={"#hijo" + process.pid}>
                    <th scope="row">{index + 1}</th>
                    <td>{process.pid}</td>
                    <td>{process.name}</td>
                    <td>{process.state}</td>
                    <td>
                      <button className="btn btn-danger">
                        KILL
                      </button>
                    </td>
                  </tr>
                {process.childs.length > 0 &&
                  <tr>
                    <td colSpan="4" className="hiddenRow">
                      <div id={"hijo" + process.pid} className="collapse">
                        <table className="table mb-0">
                          <thead>
                            <tr>
                              <th scope="row">#</th>
                              <td>PID</td>
                              <td>Nombre</td>
                              <td>Estado</td>
                            </tr>
                          </thead>
                          <tbody>
                            {process.childs.map((childProcess, i) => {
                              return(
                                <tr key={"hijo" + childProcess.pid+i+"p"}>
                                  <th scope="row">{i + 1}</th>
                                  <td>{childProcess.pid}</td>
                                  <td>{childProcess.name}</td>
                                  <td>{childProcess.state}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                }
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default ProcessInfo