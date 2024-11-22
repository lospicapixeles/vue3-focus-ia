import { storeToRefs } from 'pinia'
import { sesion } from '../store/sesion'

const useSesion = () => {
    const storeRef = storeToRefs(sesion());

    return {
        ...storeRef,
        getAulasCombo: sesion().getAulasCombo,
        getSesionsByAulaId: sesion().getSesionsByAulaId,
        getCursosCombo: sesion().getCursosCombo,
        getDocentesCombo: sesion().getDocentesCombo,
        onSubmit: sesion().onSubmit,
        resetForm: sesion().resetForm
    }
}

export default useSesion
