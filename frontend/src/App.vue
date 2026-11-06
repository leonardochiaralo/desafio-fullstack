<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from './types/task'

const tasks = ref<Task[]>([
  { id: '1', title: 'Tarefa 1', done: false },
  { id: '2', title: 'Tarefa 2', done: true },
])
</script>

<template>
  <main>
    <h1>Minhas Tarefas</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }}
      </li>
    </ul>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  max-width: 480px;
  padding: 32px;
  background-color: var(--card-background-color);
  border: 1px solid var(--card-border-color);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.06);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
