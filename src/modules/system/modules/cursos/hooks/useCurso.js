import { storeToRefs } from 'pinia'
import { curso } from '../store/curso'

const useCurso = () => {
    const storeRef = storeToRefs(curso());

    return {
        ...storeRef,
        getCursos: curso().getCursos,
        onSubmit: curso().onSubmit,
        onDelete: curso().onDelete
    }
}

export default useCurso
