<script setup>

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { calendarConfiguration } from '@/store';

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const loadingError = ref(false)

onMounted(() => {
  let data = route.params.data;
  let parsedData = [];

  try {
    parsedData = JSON.parse(atob(data));
  } catch (error) {
    loadingError.value = true;
    return
  } finally {
    loading.value = false;
  }

  calendarConfiguration.setCalendars(parsedData);

  router.push({name: "calendar"})
})

</script>

<template>
  <div class="pt-4">
    <div class="mx-4 bg-white rounded shadow">
      <p
        v-if="loading"
        class="px-4 py-2"
      >
        Loading ...
      </p>
    </div>
  </div>
</template>