import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import { ExampleItem } from '../types'

/**
 * Query Keys
 * Centralized query key definitions for cache management
 */
export const queryKeys = {
  todos: ['todos'] as const,
  todo: (id: number) => ['todos', id] as const,
}

/**
 * Example: Simple GET query
 * Fetches a list of items
 */
export function useExampleData() {
  return useQuery({
    queryKey: queryKeys.todos,
    queryFn: async () => {
      // Using JSONPlaceholder as a demo API
      const data = await api.get<ExampleItem[]>('/todos?_limit=10')
      return data.map(item => ({
        ...item,
        // Transform the data if needed
        description: `Todo item #${item.id}`,
      }))
    },
  })
}

/**
 * Example: Parameterized query
 * Fetches a single item by ID
 */
export function useItemById(id: number) {
  return useQuery({
    queryKey: queryKeys.todo(id),
    queryFn: async () => {
      const data = await api.get<ExampleItem>(`/todos/${id}`)
      return {
        ...data,
        description: `Todo item #${data.id}`,
      }
    },
    enabled: id > 0, // Only fetch if ID is valid
  })
}

/**
 * Example: Mutation with cache invalidation
 * Creates a new item and invalidates the list cache
 */
export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newItem: Partial<ExampleItem>) => {
      return api.post<ExampleItem>('/todos', newItem)
    },
    onSuccess: () => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: queryKeys.todos })
    },
    onError: (error) => {
      console.error('Failed to create item:', error)
    },
  })
}

/**
 * Example: Mutation for updating an item
 */
export function useUpdateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ExampleItem> }) => {
      return api.put<ExampleItem>(`/todos/${id}`, data)
    },
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific item
      queryClient.invalidateQueries({ queryKey: queryKeys.todos })
      queryClient.invalidateQueries({ queryKey: queryKeys.todo(variables.id) })
    },
  })
}

/**
 * Example: Mutation for deleting an item
 */
export function useDeleteItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/todos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos })
    },
  })
}
