import { defineStore } from 'pinia'
import authApi from '../../../apis/authApi'
// import systemApi from '../../../apis/systemApi'
// import * as jose from 'jose'

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
            if(localStorage.getItem('_u_')){
                let user = JSON.parse(localStorage.getItem('_u_'))
                this.user = user?.user
                this.isAuth = true
                return true
            }else{
                this.logout()
                return false;
            }
        },
        async checkLogout(){
            let user = null
            if(localStorage.getItem('_u_')){
                user = JSON.parse(localStorage.getItem('_u_'))
                this.user = user?.user
                this.isAuth = true
                return false
            }else{
                this.logout()
                return true;
            }
        },
        logout(){
            localStorage.removeItem('_u_')
            localStorage.removeItem('_m_')
        },
        async onAuth(){
            this.isLoading = true
            try{
                const { data } = await authApi.post('/auth/login', this.auth)
                this.user = data.user
                localStorage.setItem('_u_', JSON.stringify(data))
                window.location.href = '/'
            }catch(e){
                this.auth.error = e.response.data.error
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