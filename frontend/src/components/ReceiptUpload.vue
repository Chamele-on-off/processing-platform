<template>
  <input type="file" @change="handleUpload" accept=".pdf" />
</template>

<script setup>
import { useTraderStore } from '@/stores/trader'

const store = useTraderStore()

const handleUpload = async (e) => {
  const file = e.target.files[0]
  await store.uploadReceipt(file)
}
</script>
