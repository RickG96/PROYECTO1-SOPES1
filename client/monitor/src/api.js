import http from './http-common';

const getRam = () => {
    return http.get('/modulo_ram');
}

const getProcess = () => {
    return http.get('/modulo_cpu');
}

const killProcess = (pid) => {
    return http.get(`/kill_process/${pid}`);
}

export default {
    getRam,
    getProcess,
    killProcess
}