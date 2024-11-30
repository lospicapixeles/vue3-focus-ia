import { storeToRefs } from 'pinia'
import { system } from '../store/system'

const useSystem = () => {
    const storeRef = storeToRefs(system());

    return {
        ...storeRef,
        getEmociones: system().getEmociones,
        getEmocionesBySesionsID: system().getEmocionesBySesionsID
    }
}

export default useSystem
