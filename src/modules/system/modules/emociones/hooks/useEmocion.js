import { storeToRefs } from 'pinia'
import { emocion } from '../store/emocion'

const useEmocion = () => {
    const storeRef = storeToRefs(emocion());

    return {
        ...storeRef,
        getCursosByDocenteId: emocion().getCursosByDocenteId,
        getSesionesByCursosId: emocion().getSesionesByCursosId,
        getEmocionesBySesionesId: emocion().getEmocionesBySesionesId,
        getEmocionesUsersBySesionesId: emocion().getEmocionesUsersBySesionesId
    }
}

export default useEmocion
