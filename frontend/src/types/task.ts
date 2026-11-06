interface Task {
  id: string
  title: string
  done: boolean
}

type TaskFilter = 'all' | 'pending' | 'done'

export type { Task, TaskFilter }
