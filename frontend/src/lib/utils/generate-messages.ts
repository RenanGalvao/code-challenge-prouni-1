import type { GenerateMessagesOptions, Message } from '@/lib/types/index.js'

export function generateMessages(messages: GenerateMessagesOptions[]): Message[] {
  return messages.map((msg) => ({
    id: msg.id ?? Math.floor(Math.random() * Date.now()),
    message: msg.message,
    variant: msg.variant ?? 'danger',
    silent: msg.silent ?? false,
    duration: msg.duration ?? 5 * 1000 // default value from toast.svelte
  }))
}
