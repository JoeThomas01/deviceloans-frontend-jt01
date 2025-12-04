// src/composables/useDevices.ts

import { ref, type Ref } from 'vue';
import { appConfig } from '@/config/appConfig';

export type Device = {
  id: string;
  label?: string;
  deviceType?: string;
  serialNumber?: string;
  status?: string;
  loanedTo?: string;
  loanStartDate?: string;
  dueDate?: string;
};

const RAW_API_BASE = appConfig.apiBaseUrl;

// Normalise so whether you set .../api or .../api/ it works
const API_BASE = RAW_API_BASE.replace(/\/$/, ''); // strip trailing slash if present

export function useDevices() {
  const devices: Ref<Device[]> = ref([]);
  const loading = ref(false);
  const error: Ref<string | null> = ref(null);

  const fetchDevices = async (force = false) => {
    if (loading.value) return;
    if (!force && devices.value.length > 0) return;

    loading.value = true;
    error.value = null;

    try {
      const url = `${API_BASE}/devices`;
      console.debug('Requesting devices from:', url);

      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch devices: ${res.status} ${res.statusText}`,
        );
      }

      const data = await res.json();

      // Support both plain array and { data: [...] } shapes
      const items = Array.isArray(data)
        ? data
        : Array.isArray((data as any).data)
          ? (data as any).data
          : [];

      devices.value = items as Device[];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  return { devices, loading, error, fetchDevices };
}
