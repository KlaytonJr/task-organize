<template>
  <v-card @click="$emit('action')">
    <template v-slot:prepend>
      <div class="card">
        <div :class="`icon-container ${className}`">
          <v-icon color="white" :icon="icon" size="45px"></v-icon>
        </div>
        <div class="details">
          <v-card-text class="title">{{ title }}</v-card-text>
          <v-card-text>{{ value }}</v-card-text>
        </div>
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
export default {
    emits: ['action'],
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            default: '', 
        },
    },
    setup() {},
}
</script>

<style scoped>
.v-card {
    width: 100%;
    cursor: pointer;
}

.card {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.icon-container {
    padding: 10px;
    border-radius: 5px;
    margin-right: 15px;
}

.icon-container.blue {
    background-color: #3498db;
}
.icon-container.yellow {
    background-color: #f1c40f;
}
.icon-container.green {
    background-color: #2ecc71;
}
.icon-container.gray {
    background-color: #bdc3c7;
}

.details {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
}

.details > .v-card-text.title {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 5px;
}

.details > .v-card-text {
    padding: 0;
    margin: 0;
    font-size: 22px;
    font-weight: normal;
}
</style>
