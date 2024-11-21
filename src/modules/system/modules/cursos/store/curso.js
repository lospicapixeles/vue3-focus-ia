import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from 'vue3-toastify'

export const curso = defineStore("curso", {
  state: () => ({
    isLoading: false,
    openModal: false,
    cursos: [],
    new_curso: {
      nombre: '',
      descripcion: '',
      creditos: 1
    },
    pag: {
        buscar: '', 
        total: 0,
        page: 1, 
        cant_reg: 999,
    } 
  }),
  actions: {
    async getCursos(){
      const { data } = await systemApi.get('/cursos', {
        params: this.pag
      })
      this.cursos = data.data;
      this.pag.total = data.total;
    },
    async onSubmit(){
       this.isLoading = true
       if(this.new_curso.id){
            
       }else{
          try{
            const { data } = await systemApi.post('/cursos', this.new_curso)
            await this.getCursos()
            toast.success(data.message)
            this.openModal = false
          }catch(e){
            toast.error(e.response.data.message)
          }finally{
            this.isLoading = false
          }
       }
    },
    async onDelete(id){
      try{
        const { data } = await systemApi.delete(`/cursos/${id}`)
        toast.success(data.message)
        await this.getCursos()
      }catch(e){
        toast.error(e.response.data.message)
      }
    }
  }
})
