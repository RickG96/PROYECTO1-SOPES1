import http from './http-common';

const getRam = () => {
    return http.get('/modulo_ram');
}

export default {
    getRam
}