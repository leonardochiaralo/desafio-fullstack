<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Task, TaskFilter } from './types/task'
import TodoItem from './components/TodoItem.vue'
import TodoForm from './components/TodoForm.vue'
import TodoFilter from './components/TodoFilter.vue'

const tasks = ref<Task[]>([])
const activeFilter = ref<TaskFilter>('all')

const filteredTasks = computed(() => {
  if (activeFilter.value === 'pending') return tasks.value.filter((task) => !task.done)
  if (activeFilter.value === 'done') return tasks.value.filter((task) => task.done)
  return tasks.value
})
const completedCount = computed(() => tasks.value.filter((task) => task.done).length)
const pendingCount = computed(() => tasks.value.length - completedCount.value)

const toggleTask = (id: string) => {
  const task = tasks.value.find((task) => task.id === id)
  if (task) {
    task.done = !task.done
  }
}

const removeTask = (id: string) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

const addTask = (title: string) => {
  tasks.value.push({
    id: crypto.randomUUID(),
    title,
    done: false,
  })
}
</script>

<template>
  <main>
    <header class="header">
      <h1>Minhas Tarefas</h1>
      <p class="summary">{{ completedCount }} de {{ tasks.length }} concluídas</p>
    </header>
    <TodoForm @add="addTask" />
    <TodoFilter
      :active-filter="activeFilter"
      :counts="{ all: tasks.length, pending: pendingCount, done: completedCount }"
      @change="activeFilter = $event"
    />
    <div v-if="tasks.length === 0" class="empty">
      <p class="empty-title">Nenhuma tarefa por aqui</p>
      <p class="empty-hint">Adicione a primeira tarefa no campo acima</p>
    </div>
    <div v-else-if="filteredTasks.length === 0" class="empty">
      <p class="empty-title">Nenhuma tarefa neste filtro</p>
    </div>
    <ul v-else>
      <TodoItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
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

  ul {
    list-style: none;
    border: 1px solid var(--card-border-color);
    border-radius: 8px;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .summary {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary-color);
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 24px 0;
    text-align: center;

    .empty-title {
      font-size: 15px;
      font-weight: 600;
    }

    .empty-hint {
      font-size: 14px;
      color: var(--text-secondary-color);
    }
  }
}
</style>
