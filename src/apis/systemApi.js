import axios from "axios";

let user = {
    token: '',
}
if(localStorage.getItem('_u_') !== null){
    user = JSON.parse(localStorage.getItem('_u_'))
}

const systemApi = axios.create({
    /** Ruta base de la API, funciona siempre y cuando el usuario este logueado */
    // Producción: https://ali.blocmin.com/api
    // Local (.env.local): http://127.0.0.1:9001/api → Laravel local + BD remota + posture-api local
    baseURL: import.meta.env.VITE_API_URL || 'https://ali.blocmin.com/api',
    headers: {
        'Authorization': `Bearer ${user?.token}`
    }
})

export default systemApi
