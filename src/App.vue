<script setup>
import { ref, onMounted } from 'vue';
import * as ICAL from "ical.js";

import EventCalendar from "@/components/EventCalendar.vue";
import EventList from "@/components/EventList.vue";

const vCalendar = "";
const vContent = ref();
const vEvents = ref([]);

function load() {
  fetch(vCalendar).then(async (response) => {
    vContent.value = await response.text();
    let jCal = ICAL.parse(vContent.value);

    let comp = new ICAL.Component(jCal);
    let vevents = comp.getAllSubcomponents("vevent");

    vevents.forEach(function(vevent) {
      let event = new ICAL.Event(vevent)

      vEvents.value.push({
        "uid": event.uid,
        "title": event.summary,
        "description": event.description,
        "startDate": event.startDate.toJSDate(),
        "endDate": event.endDate.toJSDate(),
      })
    })

  });
}

onMounted(() => {
  load();
})

</script>

<template>
  <div class="flex flex-row bg-gray-100">
    <div class="basis-9/12">
      <EventCalendar :v-events="vEvents" />
    </div>
    <div class="basis-3/12">
      <EventList :v-events="vEvents" />
    </div>
  </div>
</template>

<style scoped>

</style>
