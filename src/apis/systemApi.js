import axios from "axios";

let user = {
    token: '',
}
if(localStorage.getItem('_u_') !== null){
    user = JSON.parse(localStorage.getItem('_u_'))
}

const systemApi = axios.create({
    /** Ruta base de la API, funciona siempre y cuando el usuario este logueado */
    //baseURL: 'https://ali.credisur-peru.com/api',
    baseURL: 'https://ali.blocmin.com/api',
    headers: {
        'Authorization': `Bearer ${user?.token}`
    }
})

export default systemApi
