import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'
import format from 'date-fns/format'

export const live = defineStore("live", {
  state: () => ({
    isLoading: false,
    new_emocion: {
      sesions_id: null
    },
    camaras: []
  }),
  actions: {
    async getLives(){
       
    },
    async getCamaras(){
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          this.camaras = devices.filter(device => device.kind === 'videoinput'); // Filtrar solo las cámaras
        })
        .catch(error => {
          console.error('Error al obtener dispositivos:', error);
        });
    },
    async onSubmit(face){
      const { data } = await systemApi.post('/emociones',  {
        sesions_id: this.new_emocion.sesions_id,
        face
      })
      console.log(data)
    },
  }
})
