import { defineStore } from 'pinia'
import systemApi from '../../../apis/systemApi'

export const system = defineStore('system', {
    state: () => ({
        openSidebar: true,
        emociones_generales: [],
        emociones: [],
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
            neutral: "#fff",
            sad: "#bfdbfe",
            surprised: "#fed7aa",
        }
    }),
    actions: {
        async getEmociones(){
            try{
                const { data } = await systemApi.get('/get_emociones')
                const total = Object.values(data).reduce((sum, value) => sum + value, 0);
                this.emociones_generales = Object.entries(data)
                    .map(([name, value]) => ({
                        name: this.letraMap[name],
                        emoji: this.emotionMap[name],
                        percentage: ((value / total) * 100).toFixed(2), // Convert to percentage
                        color: this.colorMap[name]
                    }))
                    .sort((a, b) => b.percentage - a.percentage);
            }catch(e){
                console.log(e)
            }
        },
        async getEmocionesBySesionsID(sesions_id){
            try{
                const { data } = await systemApi.get('/get_emociones_by_sesions_id', {
                    params: {
                        sesions_id
                    }
                })
                this.emociones = data
            }catch(e){
                console.log(e)
            }
        }
    }
})  
