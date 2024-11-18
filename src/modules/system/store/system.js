import { defineStore } from 'pinia'
import systemApi from '../../../apis/systemApi'

export const system = defineStore('system', {
    state: () => ({
        openSidebar: true,
    }),
    actions: {

    }
})  