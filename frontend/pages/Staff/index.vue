<template>
    
    <v-container>

        <h1 class="text-center">DashBoard</h1>

        <v-row justify="center">
            <v-col cols="12" md="4" v-for="b in box1" :key="b">
                <v-card>
                    <v-card-title>{{ b.title }}</v-card-title>
                    <v-catd-text>{{ b.value }}</v-catd-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="4" v-for="b in box2" :key="b">
                <v-card>
                    <v-card-title>{{ b.title }}</v-card-title>
                    <v-catd-text>{{ b.value }}</v-catd-text>
                </v-card>
            </v-col>
        </v-row>

    </v-container>


</template>

<script setup lang="ts">
import axios from 'axios';
import {api} from '../../API/base'

const box1 = ref([])
const token = import.meta.client ? localStorage.getItem('token'):null

const fetch = async()=>{

    const res1 = await axios.get(`${api}/dash/staff`,{headers:{Authorization:`Bearer ${token}`}})
    box1.value = res1.data.box1
    box1.value = res1.data.box2

}

onMounted(fetch)


</script>

<style scoped>

</style>