import { defineStore } from 'pinia'
import authApi from '../../../apis/authApi'
import * as jose from 'jose'

const getSession = () => {
    const raw = localStorage.getItem('_u_')
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

const getToken = (session) => session?.token ?? session?.access_token ?? ''

const isSessionExpired = (token) => {
    if (!token || token.split('.').length !== 3) return false
    try {
        const payload = jose.decodeJwt(token)
        return Boolean(payload.exp && payload.exp * 1000 < Date.now())
    } catch {
        return true
    }
}

export const auth = defineStore('auth', {
    state: () => ({
        user: {},
        isAuth: false,
        isLoading: false,
        auth: {
            email: '',
            password: '',
            error: ''
        }
    }),
    actions: {
        async checkLogin(){
            const session = getSession()
            const token = getToken(session)
            if (!token || isSessionExpired(token)) {
                this.logout()
                return false
            }
            this.user = session?.user ?? {}
            this.isAuth = true
            return true
        },
        async checkLogout(){
            const session = getSession()
            const token = getToken(session)
            if (token && !isSessionExpired(token)) {
                this.user = session?.user ?? {}
                this.isAuth = true
                return false
            }
            this.logout()
            return true
        },
        logout(){
            localStorage.removeItem('_u_')
            localStorage.removeItem('_m_')
            this.user = {}
            this.isAuth = false
        },
        async onAuth(){
            this.isLoading = true
            this.auth.error = ''
            try{
                const { data } = await authApi.post('/auth/login', this.auth)
                const token = data.token ?? data.access_token
                this.user = data.user
                this.isAuth = true
                localStorage.setItem('_u_', JSON.stringify({
                    ...data,
                    token,
                    user: data.user
                }))
                window.location.href = '/'
            }catch(e){
                this.auth.error = e.response?.data?.error ?? 'No se pudo iniciar sesión'
            }finally{
                this.isLoading = false
            }
        },
        onLogout(){
            this.isLoading = true
            try{
                this.logout()
                window.location.href = '/login'
            }catch(e){
                console.log(e)
            }finally{
                this.isLoading = false
            }
        }
    }
})