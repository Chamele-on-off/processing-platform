<template>
  <div>
    <h2>Баланс: {{ balance }} ₽</h2>
    <button @click="toggleRequests('in')">
      {{ acceptIncoming ? 'Выключить входящие' : 'Включить входящие' }}
    </button>
    <TransactionList />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTraderStore } from '@/stores/trader'

const store = useTraderStore()
const balance = ref(0)
const acceptIncoming = ref(false)

const toggleRequests = async (direction) => {
  await store.toggleRequests(direction, !acceptIncoming.value)
  acceptIncoming.value = !acceptIncoming.value
}
</script>
