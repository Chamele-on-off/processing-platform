<template>
  <div class="transaction-list">
    <!-- Фильтры -->
    <div class="filters">
      <select v-model="filterMethod">
        <option value="all">Все методы</option>
        <option value="sbp">СБП</option>
        <option value="c2c">С2С</option>
      </select>
      <input v-model="filterMinAmount" type="number" placeholder="Мин сумма">
      <input v-model="filterMaxAmount" type="number" placeholder="Макс сумма">
    </div>

    <!-- Список заявок -->
    <div v-for="tx in filteredTransactions" :key="tx.id" class="transaction-item">
      <span>{{ tx.id }}</span>
      <span>{{ tx.amount }} ₽</span>
      <span>{{ tx.method }}</span>
      <button @click="openDispute(tx.id)">Оспорить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTraderStore } from '@/stores/trader'

const store = useTraderStore()
const filterMethod = ref('all')
const filterMinAmount = ref(null)
const filterMaxAmount = ref(null)

const filteredTransactions = computed(() => {
  return store.transactions.filter(tx => {
    const methodMatch = filterMethod.value === 'all' || tx.method === filterMethod.value
    const minMatch = !filterMinAmount.value || tx.amount >= filterMinAmount.value
    const maxMatch = !filterMaxAmount.value || tx.amount <= filterMaxAmount.value
    return methodMatch && minMatch && maxMatch
  })
})

const openDispute = (txId) => {
  store.openDispute(txId)
}
</script>
