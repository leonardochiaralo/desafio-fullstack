<script setup lang="ts">
import type { TaskFilter } from '../types/task'

defineProps<{
  activeFilter: TaskFilter
  counts: Record<TaskFilter, number>
}>()

const emit = defineEmits<{
  change: [filter: TaskFilter]
}>()

const options: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'done', label: 'Concluídas' },
]
</script>

<template>
  <div class="filters" role="group" aria-label="Filtrar tarefas">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="{ active: option.value === activeFilter }"
      :aria-pressed="option.value === activeFilter"
      @click="emit('change', option.value)"
    >
      {{ option.label }}
      <span class="count">{{ counts[option.value] }}</span>
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  background-color: var(--background-color);
  border-radius: 10px;

  button {
    flex: 1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: none;
    border: none;
    border-radius: 6px;
    color: var(--text-secondary-color);
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      color: var(--text-color);
    }

    &.active {
      background-color: var(--card-background-color);
      color: var(--text-color);
      box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1);
    }

    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .count {
      font-size: 12px;
      opacity: 0.8;
    }
  }
}
</style>
