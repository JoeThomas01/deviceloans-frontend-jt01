<script setup lang="ts">
import { onMounted } from 'vue';
import { useDevices } from '@/composables/useDevices';

const { devices, loading, error, fetchDevices } = useDevices();

onMounted(() => {
  fetchDevices();
});

const formatStatus = (status?: string) => status ?? 'unknown';
</script>

<template>
  <div class="products-view">
    <h1>Devices - (TESTING TESTING TESTING)</h1>

    <div v-if="loading" class="loading">Loading devices…</div>

    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="fetchDevices(true)">Retry</button>
    </div>

    <div v-else-if="devices.length === 0" class="empty">No devices found.</div>

    <ul v-else class="list">
      <li v-for="d in devices" :key="d.id" class="card">
        <div class="row">
          <strong class="name">
            {{ d.label ?? d.id }}
          </strong>
          <span class="price">
            {{ formatStatus(d.status) }}
          </span>
        </div>

        <p class="desc">
          <span v-if="d.deviceType">Type: {{ d.deviceType }}</span>
          <span v-if="d.serialNumber"> • Serial: {{ d.serialNumber }} </span>
          <span v-if="d.loanedTo"> • On loan to: {{ d.loanedTo }} </span>
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.products-view {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}
.list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.name {
  color: #1f2937;
}
.price {
  color: #065f46;
  font-weight: 600;
  text-transform: capitalize;
}
.desc {
  color: #6b7280;
  margin-top: 0.5rem;
}
.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
}
.error button {
  margin-top: 0.5rem;
}
</style>
