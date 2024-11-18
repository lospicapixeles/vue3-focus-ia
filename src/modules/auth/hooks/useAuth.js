import { storeToRefs } from 'pinia'
import { auth } from '../store/auth'

const useAuth = () => {
    const storeRef = storeToRefs(auth());

    return {
        ...storeRef,
        checkLogin: auth().checkLogin,
        checkLogout: auth().checkLogout,
        onAuth: auth().onAuth,
    }
}

export default useAuth