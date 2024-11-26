import { storeToRefs } from 'pinia'
import { live } from '../store/live'

const useLive = () => {
    const storeRef = storeToRefs(live());

    return {
        ...storeRef,
        onSubmit: live().onSubmit
    }
}

export default useLive
