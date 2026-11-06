<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <li :class="{ done: task.done }">
    <input
      type="checkbox"
      :checked="task.done"
      :id="`task-${task.id}`"
      @change="emit('toggle', task.id)"
    />
    <label :for="`task-${task.id}`">{{ task.title }}</label>
    <button type="button" aria-label="Remover tarefa" @click="emit('remove', task.id)">×</button>
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
