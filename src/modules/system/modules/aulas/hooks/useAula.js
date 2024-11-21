import { storeToRefs } from 'pinia'
import { aula } from '../store/aula'

const useAula = () => {
    const storeRef = storeToRefs(aula());

    return {
        ...storeRef,
        getAulas: aula().getAulas,
        onSubmit: aula().onSubmit,
        onDelete: aula().onDelete
    }
}

export default useAula
