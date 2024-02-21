<script setup>
import { ref } from 'vue';
import { setDefaultOptions, format } from "date-fns";
import { de } from "date-fns/locale";

setDefaultOptions({ weekStartsOn: 1, locale: de})

const props = defineProps({vEvents: {type: Array, default: Array}});
const events = ref(props.vEvents);

</script>

<template>
  <div class="pt-4 h-screen overflow-hidden">
    <div class="flex flex-col gap-4">
      <div
        v-for="event in events"
        :key="event.uid"
        class="flex flex-row py-2 bg-white drop-shadow rounded mx-4 border-l-4 border-red-400"
      >
        <!-- date & time -->
        <div class="w-28">
          <p class="text-center">
            {{ format(event.startDate, 'EEE') }}
          </p>
          <p class="text-center text-xl font-semibold">
            {{ format(event.startDate, 'dd') }}
          </p>
          <p class="text-center">
            {{ format(event.startDate, 'MMM') }}
          </p>
        </div>

        <!-- title & description -->
        <div class="grow">
          <p class="font-bold mb-2">
            {{ event.title }}
          </p>
          <p class="text-info text-slate-500 whitespace-pre">
            {{ event.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 bg-gradient-to-t from-gray-100 h-[10%] ml-1" />
  </div>
</template>
