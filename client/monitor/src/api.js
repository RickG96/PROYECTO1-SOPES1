import http from './http-common';

const getRam = () => {
    return http.get('/ram');
}

const getCpu = () => {
    return http.get('/cpu_usage');
}

const getProcess = () => {
    return http.get('/proc');
}

const killProcess = (uid) => {
    return http.get(`/proc/${uid}`);
}

export default {
    getRam,
    getProcess,
    killProcess,
    getCpu
}