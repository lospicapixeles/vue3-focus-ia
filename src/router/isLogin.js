import useAuth from "../modules/auth/hooks/useAuth";

const isLogin = async (to, from, next) => {
    
    const {
        checkLogin
    } = useAuth()

    const ok = await checkLogin();

    if(ok) next()
    else next('/login')
}

export default isLogin