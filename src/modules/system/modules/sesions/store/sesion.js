import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'

export const sesion = defineStore("sesion", {
  state: () => ({
    isLoading: false,
    openModal: false,
    aulasCombo: [],
    new_sesion: {
      fecha_inicio: '',
      fecha_fin: '',
      aulas_id: null,
      cursos_id: null,
    },
    sesions: []
  }),
  actions: {
    async getAulasCombo(){
      try{
        const { data } = await systemApi.get('/aulas_combo')
        this.aulasCombo = data
      }catch(e){
        toast.error(e.response.data.message)
      }
    },
    async getSesionsByAulaId(){
      try{
        const { data } = await systemApi.get('/sessions_by_aulas_id', {
          params: {
            aulas_id: this.new_sesion.aulas_id
          }
        })
        this.sesions = data.map(item => ({
          id: item.id,
          title: item.nombre,
          start: item.fecha_inicio,
          end: item.fecha_fin,
          allDay: item.allDay == 0 ? false : true,
          color: item.color,
          textColor: item.textColor
        }))
      }catch(e){
        toast.error(e.response.data.message)
      }
    }
  },
})
