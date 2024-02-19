<script setup>
import { ref, onMounted } from 'vue';
import * as ICAL from "ical.js";

import Calendar from "@/Calendar.vue";
import List from "@/List.vue";

const v_calendar = "";
const v_content = ref();
const v_events = ref([]);

function load() {
  fetch(v_calendar).then(async (response) => {
    v_content.value = await response.text();
    let jCal = ICAL.parse(v_content.value);

    let comp = new ICAL.Component(jCal);
    let vevents = comp.getAllSubcomponents("vevent");

    vevents.forEach(function(vevent) {
      let event = new ICAL.Event(vevent)

      v_events.value.push({
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
  <div class="flex flex-row">
    <div class="basis-9/12 border-r-2"><Calendar /></div>
    <div class="basis-3/12"><List :v_events="v_events"/></div>
  </div>
</template>

<style scoped>

</style>
