<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchData, idUserLogged } from '@/services/api';
import Card from '@/components/dash/Card.vue'
import { TaskDTO, StatusEnum } from '@/dto/TaskDTO'

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

const router = useRouter();

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

function getDataOptionMyTask(tasks: TaskDTO[]) {
  const opened = tasks.filter((task: TaskDTO) => task.status === StatusEnum.OPEN && task.responsible._id === idUserLogged).length;
  const finished = tasks.filter((task: TaskDTO) => task.status === StatusEnum.FINISHED && task.responsible._id === idUserLogged).length;

  return [
    { value: opened, name: 'Em Aberto', itemStyle: { color: '#f1c40f' } },
    { value: finished, name: 'Finalizadas', itemStyle: { color: '#2ecc71' } },
  ];
}

function setTotalDash(tasks: TaskDTO[]) {
  totalMyTask.value = tasks.filter((task: TaskDTO) => task.responsible._id === idUserLogged).length;
  totalOpened.value = tasks.filter((task: TaskDTO) => task.status === StatusEnum.OPEN).length;
  totalFinished.value = tasks.filter((task: TaskDTO) => task.status === StatusEnum.FINISHED).length;
  totalAll.value = tasks.length;
}

function getyAxisOptionTaskResponsible(tasks: TaskDTO[]) {
    const names = [...new Set(tasks.map((task: TaskDTO) => task.responsible.name))];
    return { type: 'category', data: names };
}

function getSeriesOptionTaskResponsible(tasks: TaskDTO[]) {
    const dataOpened = [];
    const dataFinished = [];

    const ids = [...new Set(tasks.map((task: TaskDTO) => task.responsible._id))];
    ids.forEach((id) => {
      dataOpened.push(tasks.filter((task: TaskDTO) => (task.status === StatusEnum.OPEN && task.responsible._id === id)).length);
      dataFinished.push(tasks.filter((task: TaskDTO) => (task.status === StatusEnum.FINISHED && task.responsible._id === id)).length);
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
        <Card
            title="Minhas"
            :value="totalMyTask"
            icon="mdi-lightbulb-on-outline"
            className="blue"
            @action="() => router.push('/tasks?filter=0')"
        />
       
        <Card
            title="Em aberto"
            :value="totalOpened"
            icon="mdi-alert-outline"
            className="yellow"
            @action="() => router.push('/tasks?filter=1')"
        />
       
        <Card
            title="Finalizadas"
            :value="totalFinished"
            icon="mdi-check"
            className="green"
            @action="() => router.push('/tasks?filter=2')"
        />
       
        <Card
            title="Todas"
            :value="totalAll"
            icon="mdi-view-grid-outline"
            className="gray"
            @action="() => router.push('/tasks?filter=3')"
        />
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
</style>

