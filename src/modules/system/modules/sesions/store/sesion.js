import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'
import format from 'date-fns/format'

export const sesion = defineStore("sesion", {
  state: () => ({
    isLoading: false,
    openModal: false,
    openModalSesion: false,
    aulasCombo: [],
    cursosCombo: [],
    new_sesion: {
      fecha_inicio: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      fecha_fin: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      aulas_id: null,
      cursos_id: null,
      docentes_id: null, //en si users_id,
      color: '#3788D8',
      curso: ''
    },
    sesions: [],
    docentesCombo: []
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
    async getCursosCombo(){
      if(this.cursosCombo.length) return
      try{
        const { data } = await systemApi.get('/cursos_combo')
        this.cursosCombo = data
      }catch(e){
        toast.error(e.response.data.message)
      }
    },
    async getDocentesCombo(){
      if(this.docentesCombo.length) return
      try{
        const { data } = await systemApi.get('/docentes_combo')
        this.docentesCombo = data
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
    },
    resetForm(){
      this.new_sesion = {
        fecha_inicio: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        fecha_fin: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        aulas_id: this.new_sesion.aulas_id,
        cursos_id: null,
        docentes_id: null, //en si users_id,
        color: '#3788D8',
        curso: ''
      }
    },
    async onSubmit(){
      this.isLoading = true
      if(this.new_sesion.id){
        
      }else{
        try{
          const { data } = await systemApi.post('/sesiones', this.new_sesion)
          toast.success(data.message)
          await this.getSesionsByAulaId()
          this.openModal = false
        }catch(e){
          toast.error(e.response.data.message)
        }finally{
          this.isLoading = false
        }
      }
    },
    async deleteSesion(){
      this.isLoading = true
      try{
        const { data } = await systemApi.delete(`/sesiones/${this.new_sesion.id}`)
        toast.success(data.message)
        this.openModalSesion = false
        await this.getSesionsByAulaId()
      }catch(e){
        toast.error(e.response.data.message)
      }finally{
        this.isLoading = false
      }
    }
  },
})
