<template>
   <v-container >
        <v-row >
            <v-col cols="12" md="8">
                <v-card >
                    <v-sheet class="pa-4 text-center" color="#404040">
                        <h1 class="text-h5 font-weight-bold">แก้ไขข้อมูลส่วนตัว</h1>
                    </v-sheet>
                    <v-card-text class="bg-white"> 
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ" v-model="form.first_name" :error-messages="error.first_name" prepend-inner-icon="mdi-alpha-f"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="นามสกุล" v-model="form.last_name" :error-messages="error.last_name" prepend-inner-icon="mdi-alpha-l"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email" prepend-inner-icon="mdi-email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="conP" :error-messages="error.conP" :prepend-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" :type="showPw2 ? 'text':'password'" @click:prepend-inner="show2 = !show2 , showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-alert>{{ form.role }}</v-alert>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn type="submit" color="primary" class="text-center ma-3">แก้ไข</v-btn>
                                        <v-btn type="reset" color="#7d0c14" class="text-center ma-3">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
   </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {eva} from '~/API/base'

// definePageMeta({
//     layout:false
// })

const form = ref(
    {
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:''
    }
)


const error = ref<Record<string,string>>({})

const conP = ref('')
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)

const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i

function validateForm(){

    error.value = {}
    const f = form.value

    if(!f.first_name.trim())error.value.first_name = 'กรุณากรอกชื่อ'
    if(!f.last_name.trim())error.value.last_name = 'กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email = 'กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email = 'รูปแบบไม่ถูกต้อง'
    if(!f.username.trim())error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if(f.first_name.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'

    if(!f.password.trim())error.value.password = 'กรุณากรอกรหัสผ่าน'
    else if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'
    else if(f.password.trim() != conP.value)error.value.conP = 'รหัสผ่านไม่ตรงกัน'

    if(!f.role.trim())error.value.role = 'กรุณากรอกประเภทสมาชิก'

    return Object.keys(error.value).length === 0

}

const saveMember = async()=>{
    const token = localStorage.getItem('token')
    if(!validateForm())return
    
    try {
        
        await axios.put(`${eva}/edit_eva`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('แก้ไขสำเร็จ')
        localStorage.removeItem('token')
        navigateTo('/',{replace:true})

    } catch (error) {
        console.error("Error put member",error)
    }

}
const fecth =async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/edit_eva`,{headers:{Authorization:`Bearer ${token}`}})
        form.value =res.data
    } catch (error) {
        console.error("Error get profile",error)
    }
}
onMounted(fecth)
</script>

<style scoped>

</style>