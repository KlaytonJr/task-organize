<script setup>
import { ref, onMounted, reactive } from 'vue';
import { fetchData, idUserLogged } from '@/services/api';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent 
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent 
]);

const optionMyTask = ref({
  title: {
    text: 'Minhas tarefas',
    left: 15,
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: 20,
    left: 'center',
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 0, name: 'Em Aberto', itemStyle: { color: '#f1c40f' } },
        { value: 0, name: 'Finalizadas', itemStyle: { color: '#2ecc71' } },
      ],
    },
  ],
});

const optionTaskResponsible = ref({
    title: {
        text: 'Tarefas por responsável',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        data: ['Em Aberto', 'Finalizadas'],
        bottom: 20,
        left: 'center',
    },
    grid: {
        bottom: '15%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
    },
    yAxis: { type: 'category', data: [] },
    series: [
        {
            name: 'Em Aberto',
            type: 'bar',
            data: [],
            color: '#f1c40f',
        },
        {
            name: 'Finalizadas',
            type: 'bar',
            data: [],
            color: '#2ecc71',
        },
    ],
});

const data = ref([]);

const totalMyTask = ref(0);
const totalOpened = ref(0);
const totalFinished = ref(0);
const totalAll = ref(0);

function getDataOptionMyTask(tasks) {
  const opened = tasks.filter((task) => task.status === 'OPEN' && task.responsible._id === idUserLogged).length;
  const finished = tasks.filter((task) => task.status === 'FINISHED' && task.responsible._id === idUserLogged).length;

  return [
    { value: opened, name: 'Em Aberto', itemStyle: { color: '#f1c40f' } },
    { value: finished, name: 'Finalizadas', itemStyle: { color: '#2ecc71' } },
  ];
}

function setTotalDash(tasks) {
  totalMyTask.value = tasks.filter((task) => task.responsible._id === idUserLogged).length;
  totalOpened.value = tasks.filter((task) => task.status === 'OPEN').length;
  totalFinished.value = tasks.filter((task) => task.status === 'FINISHED').length;
  totalAll.value = tasks.length;
}

function getyAxisOptionTaskResponsible(tasks) {
    const names = [...new Set(tasks.map((task) => task.responsible.name))];
    return { type: 'category', data: names };
}

function getSeriesOptionTaskResponsible(tasks) {
    const dataOpened = [];
    const dataFinished = [];

    const ids = [...new Set(tasks.map((task) => task.responsible._id))];
    ids.forEach((id) => {
      dataOpened.push(tasks.filter((task) => (task.status === 'OPEN' && task.responsible._id === id)).length);
      dataFinished.push(tasks.filter((task) => (task.status === 'FINISHED' && task.responsible._id === id)).length);
    });

    return [
      {
        name: 'Em Aberto',
        type: 'bar',
        data: dataOpened,
        color: '#f1c40f',
      },
      {
        name: 'Finalizadas',
        type: 'bar',
        data: dataFinished,
        color: '#2ecc71',
      },
    ];
}

onMounted(async () => {
  try {
    const dashData = await fetchData('/dash', true);
    data.value = dashData.body;
    setTotalDash(data.value);
    optionMyTask.value.series[0].data = getDataOptionMyTask(data.value);

    optionTaskResponsible.value.yAxis = getyAxisOptionTaskResponsible(data.value);
    optionTaskResponsible.value.series = getSeriesOptionTaskResponsible(data.value);
  } catch (error) {
    console.error(error)
  }
});
</script>

<template>
  <div class="container">
    <h1>Dashboard</h1>

    <div class="row">
        <v-card>
            <template v-slot:prepend>
                <div class="card">
                    <div class="icon-container blue">
                        <v-icon color="white" icon="mdi-lightbulb-on-outline" size="45px"></v-icon>
                    </div>
                    <div class="details">
                        <v-card-text class="title">Minhas</v-card-text>
                        <v-card-text>{{ totalMyTask }}</v-card-text>
                    </div>
                </div>
            </template>
        </v-card>
        
        <v-card>
            <template v-slot:prepend>
                <div class="card">
                    <div class="icon-container yellow">
                        <v-icon color="white" icon="mdi-alert-outline" size="45px"></v-icon>
                    </div>
                    <div class="details">
                        <v-card-text class="title">Em aberto</v-card-text>
                        <v-card-text>{{ totalOpened }}</v-card-text>
                    </div>
                </div>
            </template>
        </v-card>

        <v-card>
            <template v-slot:prepend>
                <div class="card">
                    <div class="icon-container green">
                        <v-icon color="white" icon="mdi-check" size="45px"></v-icon>
                    </div>
                    <div class="details">
                        <v-card-text class="title">Finalizadas</v-card-text>
                        <v-card-text>{{ totalFinished }}</v-card-text>
                    </div>
                </div>
            </template>
        </v-card>

        <v-card >
            <template v-slot:prepend>
                <div class="card">
                    <div class="icon-container gray">
                        <v-icon color="white" icon="mdi-view-grid-outline" size="45px"></v-icon>
                    </div>
                    <div class="details">
                        <v-card-text class="title">Todas</v-card-text>
                        <v-card-text>{{ totalAll }}</v-card-text>
                    </div>
                </div>
            </template>
        </v-card>
    </div>

    <div class="row">
        <v-chart class="chart" :option="optionMyTask" autoresize/>
        <v-chart class="chart" :option="optionTaskResponsible" autoresize/>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 400px;
}

.container {
    padding: 30px 100px;
}

.row {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    gap: 30px;
}

.v-card {
    width: 100%;
}

.card {
    display: flex;
    align-items: center;
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