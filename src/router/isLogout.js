import useAuth from "../modules/auth/hooks/useAuth";

const isLogout = async (to, from, next) => {
    
    const {
        checkLogout
    } = useAuth()

    const ok = await checkLogout();

    if(ok) next()
    else next('/')
}

export default isLogout