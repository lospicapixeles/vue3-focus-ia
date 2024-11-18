import { storeToRefs } from 'pinia'
import { system } from '../store/system'

const useSystem = () => {
    const storeRef = storeToRefs(system());

    return {
        ...storeRef
    }
}

export default useSystem