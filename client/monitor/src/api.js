import http from './http-common';

const getRam = () => {
    return http.get('/modulo_ram');
}

const getProcess = () => {
    return http.get('/modulo_cpu');
}

const killProcess = (uid) => {
    return http.get(`/kill_process?id=${uid}`);
}

export default {
    getRam,
    getProcess,
    killProcess
}