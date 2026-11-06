<script setup lang="ts">
import { ref } from 'vue'

const newTaskTitle = ref('')

const emit = defineEmits<{
  add: [title: string]
}>()

const handleSubmit = () => {
  const title = newTaskTitle.value.trim()
  if (!title) return
  emit('add', title)
  newTaskTitle.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input
      type="text"
      v-model="newTaskTitle"
      placeholder="O que você precisa fazer?"
      aria-label="Nova tarefa"
    />
    <button type="submit">Adicionar</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 15px;
    font-weight: 400;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
  }

  button {
    padding: 10px 16px;
    background-color: var(--primary-color);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;

    &:hover {
      background-color: var(--primary-color-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  }
}
</style>
