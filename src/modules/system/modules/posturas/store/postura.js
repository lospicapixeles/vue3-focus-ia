import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue-sonner'
import format from 'date-fns/format'
import { es } from 'date-fns/locale'

export const postura = defineStore("postura", {
  state: () => ({
    cursos: [],
    sesiones: [],
    reporte: null,
    latest: [],
    apiHealth: null,
    filtro: {
      cursos_id: null,
      sesions_id: null,
    },
    emotionMap: {
      joy: "😊",
      sadness: "😢",
      fear: "😨",
      anger: "😠",
      disgust: "🤢",
    },
    letraMap: {
      joy: "Alegría",
      sadness: "Tristeza",
      fear: "Miedo",
      anger: "Enojo",
      disgust: "Disgusto",
    },
    colorMap: {
      joy: "#fef08a",
      sadness: "#bfdbfe",
      fear: "#ddd6fe",
      anger: "#fecaca",
      disgust: "#d9f99d",
    },
  }),
  actions: {
    async getCursosByDocenteId() {
      try {
        const { data } = await systemApi.get('/cursos_by_docentes_id')
        this.cursos = data
      } catch (e) {
        toast.error(e.response?.data?.message || 'Error al cargar cursos')
      }
    },
    async getSesionesByCursosId() {
      try {
        const { data } = await systemApi.get('/sessions_by_cursos_id', {
          params: { cursos_id: this.filtro.cursos_id }
        })
        this.sesiones = data.map(item => {
          const formatoFechaInicio = format(new Date(item.fecha_inicio), "EEEE dd/MM hh:mm a", { locale: es });
          return {
            codigo: item.id,
            descripcion: `${formatoFechaInicio}`
          }
        })
      } catch (e) {
        toast.error(e.response?.data?.message || 'Error al cargar sesiones')
      }
    },
    async getReporteBySesionesId() {
      try {
        const { data } = await systemApi.get('/get_posturas_by_sesions_id', {
          params: { sesions_id: this.filtro.sesions_id }
        })
        const dist = data.distribution || {}
        const total = Object.values(dist).reduce((s, v) => s + v, 0) || 1
        data.chart = Object.entries(dist)
          .map(([name, value]) => ({
            name: this.letraMap[name] || name,
            key: name,
            emoji: this.emotionMap[name],
            percentage: ((value / total) * 100).toFixed(2),
            color: this.colorMap[name],
          }))
          .sort((a, b) => b.percentage - a.percentage)
        this.reporte = data
      } catch (e) {
        toast.error(e.response?.data?.message || 'Error al cargar reporte postural')
      }
    },
    async getLatestBySesionesId() {
      try {
        const { data } = await systemApi.get('/get_posturas_latest_by_sesions_id', {
          params: { sesions_id: this.filtro.sesions_id }
        })
        this.latest = data
      } catch (e) {
        toast.error(e.response?.data?.message || 'Error al cargar lecturas')
      }
    },
    async checkHealth() {
      // Preferir posture-api local (Docker/uvicorn); fallback a proxy Laravel
      const localUrl = import.meta.env.VITE_POSTURE_API_URL || 'http://127.0.0.1:8100'
      try {
        const { data } = await (await import('axios')).default.get(`${localUrl}/api/v1/health`, { timeout: 4000 })
        this.apiHealth = { reachable: true, posture_api: data, source: 'local' }
        return
      } catch (_) { /* fall through */ }
      try {
        const { data } = await systemApi.get('/posturas/health')
        this.apiHealth = data
      } catch (e) {
        this.apiHealth = { reachable: false }
      }
    },
    async analyzeAndPersist({ imageBase64, sesionsId, multiPerson = true }) {
      const localUrl = import.meta.env.VITE_POSTURE_API_URL || 'http://127.0.0.1:8100'
      // 1) Analizar en Docker/uvicorn local
      let analyzed
      try {
        const axios = (await import('axios')).default
        const { data } = await axios.post(`${localUrl}/api/v1/analyze/base64`, {
          image_base64: imageBase64,
          multi_person: multiPerson,
          include_landmarks: false,
        }, { timeout: 30000 })
        analyzed = data
      } catch (e) {
        // 2) Fallback: proxy Laravel (si el servidor tiene POSTURE_API_URL)
        const { data } = await systemApi.post('/posturas/analyze', {
          image_base64: imageBase64,
          sesions_id: sesionsId,
          multi_person: multiPerson,
          persist: true,
        })
        return data
      }

      // 3) Persistir en backend (Laravel local o remoto)
      if (sesionsId && analyzed?.persons?.length) {
        try {
          await systemApi.post('/posturas', {
            sesions_id: sesionsId,
            persons: analyzed.persons,
          })
          analyzed.persisted = analyzed.persons.length
        } catch (e) {
          console.warn('No se pudo persistir posturas:', e.response?.data || e.message)
        }
      }
      return analyzed
    },
  }
})
