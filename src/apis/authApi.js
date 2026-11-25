import axios from "axios";

const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ali.blocmin.com/api',
})

export default authApi
