import axios from "axios";

axios.defaults.withCredentials = true

const authApi = axios.create({
    baseURL: 'https://aliapp.blocmin.com/api',
    //baseURL: 'http://localhost:9001/api',
})

export default authApi
