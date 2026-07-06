<template>
   <v-container fluid>
    <center>
        <v-row justify="center">
            <v-col cols="12" md="6" lg="5">
                    <v-card color="#7d0c14">
                        <center><v-img src="/img/logo.png" width="30%"></v-img></center>
                        <v-card-title class="text-center"><h1>เข้าสู่ระบบ</h1><h2>NTC EVALUATION SYSTEM</h2></v-card-title>
                        <br>
                        <v-card-text class="bg-white">
                            <v-alert type="error" variant="tonal" v-if="error">{{ error }}</v-alert>
                            <v-form @submit.prevent="Login">
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="ชื่อผู้ใช้" v-model="username" prepend-inner-icon="mdi-account"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="รหัสผ่าน" v-model="password" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-select label="ประเภทสมาชิก" :items="['ฝ่ายบุคลากร','กรรมการประเมิน','ผู้รับการประเมินผล']" v-model="role" prepend-inner-icon="mdi-account-group"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn type="submit" color="primary" class="text-center ma-3">เข้าสู่ระบบ</v-btn>
                                            <v-btn type="reset" color="#7d0c14" class="text-center ma-3">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <p class="text-center text-blue"><nuxt-link to="/regis">หากไม่มีบัญชี? สมัครสมาชิก</nuxt-link></p>
                        </v-card-text>
                    </v-card>
            </v-col>
        </v-row>
    </center>
   </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api} from '../API/base'
import auth from '~/API/auth'
definePageMeta({
    layout:false
})


const error = ref('')
const show = ref(false)
const showPw = ref(false)
const username = ref('')
const password = ref('')
const role = ref('')

const Login = async()=>{
    try {
        
        const res = await auth.login(
            {
                username:username.value,
                password:password.value,
                role:role.value
            }
        )
        console.log("Log in Success",res.data)
        localStorage.setItem('token',res.data.token)
        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร') useRouter().push('/Staff')
        else if(useRole === 'กรรมการประเมิน') useRouter().push('/Committee')
        else if(useRole === 'ผู้รับการประเมินผล') useRouter().push('/Evaluatee')
        alert('สมัครสำเร็จ')

    } catch (err:any) {
        console.error('Error',err)
        error.value = error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
    }

}
</script>

<style scoped>

</style>