<template>
  <div class="app">
    <header>
      <h1>Панель трейдера</h1>
      <NotificationBell :count="unreadNotifications" />
    </header>
    <main>
      <RouterView />
    </main>
    <DisputeModal v-if="activeDispute" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTraderStore } from '@/stores/trader'
import NotificationBell from '@/components/NotificationBell.vue'
import DisputeModal from '@/components/DisputeModal.vue'

const store = useTraderStore()
const unreadNotifications = ref(0)
const activeDispute = ref(null)

onMounted(async () => {
  await store.loadData()
  // Подключение к WebSocket
  const ws = new WebSocket(`ws://${location.host}/ws`)
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'notification') unreadNotifications.value++
  }
})
</script>
