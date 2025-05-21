import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useTraderStore = defineStore('trader', () => {
  const balance = ref(0)
  const transactions = ref([])
  const disputes = ref([])

  // Загрузка данных
  const loadData = async () => {
    const res = await axios.get('/api/trader/data')
    balance.value = res.data.balance
    transactions.value = res.data.transactions
  }

  // Открытие диспута
  const openDispute = async (txId) => {
    await axios.post(`/api/trader/disputes`, { transaction_id: txId })
    disputes.value.push(txId)
  }

  // Фильтрация
  const filteredTransactions = (filters) => {
    return transactions.value.filter(tx => {
      // ... логика фильтрации (как в компоненте)
    })
  }

  return { 
    balance,
    transactions,
    disputes,
    loadData,
    openDispute,
    filteredTransactions
  }
})
