import { storeToRefs } from 'pinia'
import { usuario } from '../store/usuario'

const useUsuario = () => {
    const storeRef = storeToRefs(usuario());

    return {
        ...storeRef,
        getUsuarios: usuario().getUsuarios
    }
}

export default useUsuario