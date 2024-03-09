<script setup>
import VTableTask from '@/components/Table/VTableTask.vue';
import { useRoute } from 'vue-router'
import { onMounted, watch, reactive } from 'vue'
import { fetchData } from '@/services/api.js'

const state = reactive({
    items: []
});

const route = useRoute();

const updateItems = () => {
    fetchData(`/task/${route.query.filter}`)
        .then((resp) => {
            const updatedItems = [];
            resp.body.forEach((item) => {
                updatedItems.push({
                    id: item._id,
                    status: item.status === "OPEN" ? "Em aberto" : "Finalizado",
                    description: item.description,
                    responsible: item.responsible.name,
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
    <VTableTask :values="state.items" />
  </div>
</template>

<style scoped>
.container {
    padding: 50px 150px;
}
</style>
