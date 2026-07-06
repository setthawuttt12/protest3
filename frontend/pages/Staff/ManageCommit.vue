<template>
   <v-container fluid>
    <center>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card color="#7d0c14">
                    <v-card-title class="text-center"><h1>จัดการกรรมการประเมิน</h1></v-card-title>
                    <br>
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
                                <v-col cols="12" md="12">
                                    <v-select label="ประเภทสมาชิก" :items="['กรรมการประเมิน']" v-model="form.role" :error-messages="error.role" prepend-inner-icon="mdi-account-group"></v-select>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn type="submit" color="primary" class="text-center ma-3">{{ form.id_member ? 'อัปเดต':'บันทึก' }}</v-btn>
                                        <v-btn color="#7d0c14" class="text-center ma-3" @click="reset()">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
                <br>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
                <br>
                <v-table>
                    <thead>
                        <tr>
                            <th class="border text-center">ลำดับ</th>
                            <th class="border text-center">ชื่อ-สกุล</th>
                            <th class="border text-center">ชื่อผู้ใช้</th>
                            <th class="border text-center">อีเมล</th>
                            <th class="border text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in result" :key="items.id_member">
                            <td class="border text-center">{{ index+1 }}</td>
                            <td class="border text-center">{{ items.first_name }} &nbsp; {{ items.last_name }}</td>
                            <td class="border text-center">{{ items.username }}</td>
                            <td class="border text-center">{{ items.email }}</td>
                            <td class="border text-center">
                                <center>
                                    <v-btn class="text-center text-white ma-3" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                    <v-btn class="text-center text-white ma-3" color="red" @click="del(items.id_member)">ลบ</v-btn>
                                </center>
                            </td>
                        </tr>
                        <tr v-if="result.length ===0">
                            <td class="text-center text-red" colspan="10">ไม่พบข้อมูล</td>
                        </tr>
                    </tbody>
                </v-table>

            </v-col>
        </v-row>
    </center>
   </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const form = ref(
    {
        id_member:null,
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:''
    }
)

const reset = ()=>{

    form.value ={
        
        id_member:null,
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:''
    
    }

}
    

const error = ref<Record<string,string>>({})
const conP = ref('')
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)
const search = ref('')
const dataResult = ref([])

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
const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{

    if(!validateForm())return
    try {
        const payload = {

            first_name:form.value.first_name,
            last_name:form.value.last_name,
            email:form.value.email,
            username:form.value.username,
            password:form.value.password,
            role:form.value.role,
            ...(form.value.password ? {password:form.value.password}:null)

        }
        form.value.id_member
        ?await axios.put(`${staff}/member/update/${form.value.id_member}`,{...payload,password:form.value.password},{headers:{Authorization:`Bearer ${token}`}})
        :await axios.post(`${staff}/member/save`,payload,{headers:{Authorization:`Bearer ${token}`}})
        alert('เพิ่มข้อมูลสำเร็จ')
        conP.value = ''
        await fetch()
        await reset()

    } catch (error) {
        console.error("Error regis",error)
    }

}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/member/showC`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
    } catch (error) {
        console.error("error fetching",error)
    }

    
}

const result = computed(()=>{

    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{

        return(
            item.first_name?.toLowerCase().includes(s) ||
            item.last_name?.toLowerCase().includes(s) 
        )

    })

})

const edit = (items:any) => {

    form.value = {...items}

}

const del = async(id_member:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้"))return
    try {
        await axios.delete(`${staff}/member/del/${id_member}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error del",error)
    }
}

onMounted(fetch)
</script>

<style scoped>

</style>