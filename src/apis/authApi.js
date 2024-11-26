import axios from "axios";

axios.defaults.withCredentials = true

const authApi = axios.create({
    //baseURL: 'https://ali.credisur-peru.com/api',
    baseURL: 'http://localhost:9001/api',
})

export default authApi
