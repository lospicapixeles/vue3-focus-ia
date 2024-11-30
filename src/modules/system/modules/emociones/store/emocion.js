import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'
import format from 'date-fns/format'
import { es } from 'date-fns/locale'; // Para el idioma español

export const emocion = defineStore("emocion", {
  state: () => ({
    cursos: [],
    sesiones: [],
    emociones: null,
    alumnos: [],
    filtro: {
      cursos_id: null,
      sesions_id: null,
      alumnos_id: null
    },
    emotionMap: {
      angry: "😠",
      disgusted: "🤢",
      fearful: "😨",
      happy: "😀",
      neutral: "😐",
      sad: "😢",
      surprised: "😲",
    },
    letraMap: {
      angry: "Molesto",
      disgusted: "Disgusto",
      fearful: "Temeroso",
      happy: "Feliz",
      neutral: "Neutro",
      sad: "Triste",
      surprised: "Sorprendido",
    },
    colorMap: {
      angry: "#fecaca",
      disgusted: "#d9f99d",
      fearful: "#ddd6fe",
      happy: "#fef08a",
      neutral: "#8c8882",
      sad: "#bfdbfe",
      surprised: "#fed7aa",
    } 
  }),
  actions: {
    async getCursosByDocenteId(){
      try{
        const { data } = await systemApi.get('/cursos_by_docentes_id')
        this.cursos = data
      }catch(e){
        toast.error(e.response.data.message)
      }
    },
    async getSesionesByCursosId(){
      try{
        const { data } = await systemApi.get('/sessions_by_cursos_id', {
          params: {
            cursos_id: this.filtro.cursos_id
          }
        })
        this.sesiones = data.map(item => {
          const formatoFechaInicio = format(new Date(item.fecha_inicio), "EEEE dd/MM hh:mm a", { locale: es });
          const formatoFechaFin = format(new Date(item.fecha_fin), "EEEE dd/MM hh:mm a", { locale: es });

          return {
            codigo: item.id,
            descripcion: `${formatoFechaInicio}`
          }
        })
      }catch(e){
        toast.error(e.response.data.message)
      }
    },
    async getEmocionesBySesionesId(){
      try{
        const { data } = await systemApi.get('/get_emociones_by_sesions_id', {
          params: {
            sesions_id: this.filtro.sesions_id
          }
        })
        const total = Object.values(data).reduce((sum, value) => sum + value, 0);
        this.emociones = Object.entries(data)
              .map(([name, value]) => ({
                  name: this.letraMap[name],
                  emoji: this.emotionMap[name],
                  percentage: ((value / total) * 100).toFixed(2), // Convert to percentage
                  color: this.colorMap[name]
              }))
              .sort((a, b) => b.percentage - a.percentage);      
        }catch(e){
        toast.error(e.response.data.message)
      }
    },
    async getEmocionesUsersBySesionesId(){
      try{
        const { data } = await systemApi.get('/get_emociones_users_by_sesions_id', {
          params: {
            sesions_id: this.filtro.sesions_id
          }
        })
        this.alumnos = data
      }catch(e){
        toast.error(e.response.data.message)
      }
    }
  }
})
