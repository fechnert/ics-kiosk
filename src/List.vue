<script setup>
import { ref } from 'vue';

const props = defineProps(['v_events']);
const events = ref(props.v_events);

</script>

<template>
  <div class="flex flex-col divide-y">
    <div v-for="event in events" :key="event.uid">
      <div class="px-2 py-2">
        <p class="font-bold">{{ event.title }}</p>
<!--        <p>{{ event.startDate }} bis {{ event.endDate }}</p>-->
        <p class="whitespace-pre">{{ event.description }}</p>
      </div>
    </div>
  </div>
</template>
