import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";

export const live = defineStore("live", {
  state: () => ({
    isLoading: false,
    new_emocion: {
      sesions_id: null
    },
    camaras: []
  }),
  actions: {
    async getLives() {},

    /**
     * Lista cámaras. Pide permiso breve para obtener labels reales
     * (sin permiso el navegador oculta los nombres).
     */
    async getCamaras() {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) {
          this.camaras = []
          return []
        }

        // Permiso mínimo para etiquetar dispositivos
        try {
          const probe = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })
          probe.getTracks().forEach((t) => t.stop())
        } catch (_) {
          // Sin permiso: igual listamos (labels genéricos)
        }

        const devices = await navigator.mediaDevices.enumerateDevices()
        this.camaras = devices
          .filter((d) => d.kind === 'videoinput')
          .map((d, i) => ({
            deviceId: d.deviceId,
            label: d.label || `Cámara ${i + 1}`,
            groupId: d.groupId,
          }))
        return this.camaras
      } catch (error) {
        console.error('Error al obtener dispositivos:', error)
        this.camaras = []
        return []
      }
    },

    async onSubmit(face) {
      const { data } = await systemApi.post('/emociones', {
        sesions_id: this.new_emocion.sesions_id,
        face
      })
      return data
    },
  }
})
