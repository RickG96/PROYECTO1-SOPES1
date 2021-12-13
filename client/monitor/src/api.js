import http from './http-common';

const getRam = () => {
    return http.get('/modulo_ram');
}

const getProcess = () => {
    return http.get('/modulo_cpu');
}

export default {
    getRam,
    getProcess
}