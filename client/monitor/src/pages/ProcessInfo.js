import React, { Component } from 'react'
import PageLoading from '../components/PageLoading';
import api from '../api';

import minus from '../images/menos.png';
import plus from '../images/mas.png';

export class ProcessInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      process_types: {
        exec: 0,
        susp: 0,
        stop: 0,
        zomb: 0,
        total: 0
      },
      loading: true
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  killProcess = async (pid) => {
    try {
      const data = await api.killProcess(pid);

      this.fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  fetchData = async () => {
    this.setState({loading: true});
    try {
      const data = await api.getProcess();
      
      const arrayProcess = data.data;

      let processData = {
        exec: arrayProcess.EJECUCION,
        susp: arrayProcess.SUSPENDIDOS,
        stop: arrayProcess.DETENIDOS,
        zomb: arrayProcess.ZOMBIE,
        total: arrayProcess.PROCESOS.length
      }



      this.setState({processes: arrayProcess.PROCESOS, loading: false, process_types: processData});
    } catch(error) {
      console.error(error);
    }
  }

  render() {
    if (this.state.loading === true && !this.state.data) {
      return <PageLoading />;
    }

    return (
      <div className="container mt-3">
        <h1>Monitor de Procesos</h1>
        <hr /><br /><br />
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Procesos en ejecución
                <span className="badge bg-primary rounded-pill">{this.state.process_types.exec}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Procesos suspendidos
                <span className="badge bg-primary rounded-pill">{this.state.process_types.susp}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Procesos detenidos
                <span className="badge bg-primary rounded-pill">{this.state.process_types.stop}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Procesos zombie
                <span className="badge bg-primary rounded-pill">{this.state.process_types.zomb}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Total de procesos
                <span className="badge bg-primary rounded-pill">{this.state.process_types.total}</span>
              </li>
            </ul>
          </div>
        </div>

        <ul className="nav nav-tabs mt-5" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Procesos</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Árbol de procesos</button>
          </li>
        </ul>

        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
          <table className="table mt-5">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">PID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Usuario</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.processes.map((process, index) => {
                  return (
                    <React.Fragment>
                      <tr key={"padre" + process.PID+index+"p"} data-toggle="collapse" data-target={"#hijo" + process.PID}>
                        <th scope="row">{index + 1}</th>
                        <td>{process.PID}</td>
                        <td>{process.NOMBRE}</td>
                        <td>{process.ENAME}</td>
                        <td>{process.UNAME}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => this.killProcess(process.PID)}>
                            KILL
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <table className="table mt-5">
              <thead>
                <tr>
                  <th></th>
                  <th scope="col">#</th>
                  <th scope="col">PID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {this.state.processes.map((process, index) => {
                  return (
                    <React.Fragment>
                      <tr key={"padre" + process.PID+index+"p"} data-toggle="collapse" data-target={"#hijo" + process.PID}>
                        <th>
                          {process.childs.length > 0 
                            ? <img src={plus} alt="plus" />
                            : <img src={minus} alt="minus" />
                          }
                        </th>
                        <th scope="row">{index + 1}</th>
                        <td>{process.PID}</td>
                        <td>{process.NOMBRE}</td>
                        <td>{process.ENAME}</td>
                      </tr>
                    {process.HIJOS.length > 0 &&
                      <tr>
                        <td colSpan="4" className="hiddenRow">
                          <div id={"hijo" + process.PID} className="collapse">
                            <table className="table mb-0">
                              <thead>
                                <tr>
                                  <th scope="row">#</th>
                                  <td>PID</td>
                                  <td>Nombre</td>
                                </tr>
                              </thead>
                              <tbody>
                                {process.HIJOS.map((childProcess, i) => {
                                  return(
                                    <tr key={"hijo" + childProcess.PID+i+"p"}>
                                      <th scope="row">{i + 1}</th>
                                      <td>{childProcess.PID}</td>
                                      <td>{childProcess.NOMBRE}</td>
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
        </div>

      </div>
    )
  }
}

export default ProcessInfo