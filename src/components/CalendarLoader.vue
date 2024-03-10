<script setup>

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { calendarConfiguration } from '@/store';

const router = useRouter()
const route = useRoute()

const loadingStatus = ref({
  "loading": true,
  "error": false,
  "errorDetails": "",
})

onMounted(() => {
  let data = route.params.data;
  let parsedData = [];

  try {
    parsedData = JSON.parse(atob(data));
  } catch (error) {
    loadingStatus.value.error = true;
    loadingStatus.value.errorDetails = error.toString();
    return
  } finally {
    loadingStatus.value.loading = false;
  }

  calendarConfiguration.setCalendars(parsedData);
  router.push({name: "calendar"})
})

</script>

<template>
  <div class="pt-4">
    <div class="mx-4 bg-white rounded shadow px-4 py-2">
      <div v-if="loadingStatus.loading">
        <p>Loading ...</p>
      </div>
      <div v-if="loadingStatus.error">
        <p>Something went wrong while loading the given data!</p>
        <pre class="pt-4">{{ loadingStatus.errorDetails }}</pre>
      </div>


    </div>
  </div>
</template>