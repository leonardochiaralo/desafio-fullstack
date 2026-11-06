<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()
</script>

<template>
  <li :class="{ done: task.done }">
    <input type="checkbox" :checked="task.done" :id="`task-${task.id}`" />
    <label :for="`task-${task.id}`">{{ task.title }}</label>
    <button type="button" aria-label="Remover tarefa">×</button>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  gap: 12px;

  label {
    flex: 1;
  }

  &.done {
    label {
      text-decoration: line-through;
      color: var(--text-secondary-color);
    }
  }
}
</style>
