import { storeToRefs } from 'pinia'
import { usuario } from '../store/usuario'

const useUsuario = () => {
    const storeRef = storeToRefs(usuario());

    return {
        ...storeRef,
        getUsuarios: usuario().getUsuarios,
        onSubmit: usuario().onSubmit,
        resetForm: usuario().resetForm
    }
}

export default useUsuario
