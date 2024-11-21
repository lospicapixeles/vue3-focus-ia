import { defineStore } from "pinia";
import systemApi from "../../../../../apis/systemApi";
import { toast } from "vue3-toastify"

export const usuario = defineStore("usuario", {
  state: () => ({
    openModal: false,
    isLoading: false,
    isLoadingMessage: '',
    usuarios: [],
    new_usuario: {
        name: '',
        email: '',
        password: '123456',
        rol: 'alumno',
        face_image_url: '',
        face_image: null,
        face_descriptor: null
    },
    pag: {
        buscar: '', 
        total: 0,
        page: 1, 
        cant_reg: 10,
    }
  }),
  actions: {
    resetForm(){
        this.new_usuario = {
            name: '',
            email: '',
            password: '123456',
            rol: 'alumno',
            face_image_url: '',
            face_image: null,
            face_descriptor: null
        }
    },
    async getUsuarios(){
        const { data } = await systemApi.get('/usuarios', {
            params: this.pag
        })
        this.usuarios = data.data;
        this.pag.total = data.total;
    },
    async onSubmit(){
        this.isLoading = true
        if(this.new_usuario.id){
            try{
                const { data } = await systemApi.put(`/usuarios/${this.new_usuario.id}`, this.new_usuario)
                await this.getUsuarios()
                this.openModal = false
                toast.success(data.message)
            }catch(e){
                toast.error(e.response.data.message)
            }finally{
                this.isLoading = false
            }     
        }else{
            try{
                const { data } = await systemApi.post('/usuarios', this.new_usuario)
                await this.getUsuarios()
                this.openModal = false
                toast.success(data.message)
            }catch(e){
                toast.error(e.response.data.message)
            }finally{
                this.isLoading = false
            }     
        }
    },
    async onDelete(id){
        try{
            const { data } = await systemApi.delete(`/usuarios/${id}`)
            toast.success(data.message)
            await this.getUsuarios()
        }catch(e){
            toast.error(e.response.data.message)
        }
    }
  }
});
