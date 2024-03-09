<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar'
</script>

<template>
    <v-app style="background: #F5F5F5">
        <Navbar />
              
        <RouterView id="content"/>
    </v-app>
</template>

<style scoped>
#content {
  margin-top: 65px;
}
</style>
