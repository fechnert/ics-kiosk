<script setup>
import { ref, onMounted } from 'vue';
import { addDays, format, isToday, startOfWeek } from "date-fns";
import { de } from "date-fns/locale";


const props = defineProps(['v_events']);
const events = ref(props.v_events);
const daysToDisplay = ref([]);

onMounted(() => {
  let firstDay = startOfWeek(Date(), {weekStartsOn: 1});

  for (let i = 0; i < 35; i++) {
    daysToDisplay.value.push(addDays(firstDay, i))
  }
})

</script>

<template>

  <div class="h-screen flex flex-col divide-y">
    <div class="grid grid-cols-7 divide-x">
      <div v-for="day in daysToDisplay.slice(0,7)" class="px-2">
        <p class="font-bold">{{ format(day, 'E', {locale: de}) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-7 grow divide-x">
      <div v-for="day in daysToDisplay" class="border-b">
        <p :class="{'font-bold': isToday(day)}" class="p-2">
          {{ format(day, 'd', {locale: de}) }}
        </p>
      </div>
    </div>
  </div>

</template>
