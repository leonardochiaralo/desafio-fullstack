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
  min-height: 52px;
  padding: 8px 8px 8px 16px;
  border-bottom: 1px solid var(--card-border-color);

  &:last-child {
    border-bottom: none;
  }

  label {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  &.done {
    label {
      text-decoration: line-through;
      color: var(--text-secondary-color);
    }
  }

  button {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    border-radius: 8px;
    font-size: 20px;
    color: var(--text-secondary-color);
    cursor: pointer;

    &:hover {
      color: var(--error-color);
      background-color: var(--error-background-color);
    }

    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  }
}
</style>
