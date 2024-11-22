import { storeToRefs } from 'pinia'
import { sesion } from '../store/sesion'

const useSesion = () => {
    const storeRef = storeToRefs(sesion());

    return {
        ...storeRef,
        getAulasCombo: sesion().getAulasCombo,
        getSesionsByAulaId: sesion().getSesionsByAulaId
    }
}

export default useSesion
