<script setup>
import VTableUser from '@/components/Table/VTableUser.vue';
import { useRoute } from 'vue-router'
import { onMounted, watch, reactive } from 'vue'
import { fetchData } from '@/services/api.js'

const state = reactive({
    items: []
});

const route = useRoute();

const updateItems = () => {
    fetchData(`/user`, true)
        .then((resp) => {
            const updatedItems = [];
            resp.body.forEach((item) => {
                updatedItems.push({
                    id: item._id,
                    name: item.name,
                    email: item.email,
                })
            });
            state.items = updatedItems;
        });
}

watch(route, () => {
    updateItems();
})

onMounted(() => {
    updateItems();
})

</script>

<template>
  <div class="container">
    <VTableUser :values="state.items" />
  </div>
</template>

<style scoped>
.container {
    padding: 50px 150px;
}
</style>
