import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'
import format from 'date-fns/format'

export const live = defineStore("live", {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    async getLives(){
      
    }
  }
})
