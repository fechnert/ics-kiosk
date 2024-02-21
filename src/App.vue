<script setup>
import { ref, onMounted } from 'vue';
import * as ICAL from "ical.js";
import { add } from 'date-fns';

import EventCalendar from "@/components/EventCalendar.vue";
import EventList from "@/components/EventList.vue";

const calendarEvents = ref({});
const calendarConfiguration = ref([
  {
    url: "",
    order: 1,
    color: "red",
    refreshInterval: 300,
    lastUpdate: null,
  },
  {
    url: "",
    order: 2,
    color: "teal",
    refreshInterval: 300,
    lastUpdate: null,
  }
]);

function getAllCalendarEvents() {
  let now = new Date();
  let end = add(now, {months: 3})

  calendarConfiguration.value.forEach((calConf) => {
    fetch(calConf.url).then(async (response) => {

      let rawContent = await response.text();
      let jCal = ICAL.parse(rawContent);
      let comp = new ICAL.Component(jCal);
      let vEvents = comp.getAllSubcomponents("vevent");

      calendarEvents.value[calConf.url] = [];
      vEvents.forEach((vEvent) => {
        let event = new ICAL.Event(vEvent);
        if (event.startDate.toJSDate() <= end && event.endDate.toJSDate() >= now) {
          calendarEvents.value[calConf.url].push({
            "uid": event.uid,
            "title": event.summary,
            "description": event.description,
            "startDate": event.startDate.toJSDate(),
            "endDate": event.endDate.toJSDate(),
            "color": calConf.color,
          })
        }
      })
    })
  })
}


onMounted(() => {
  getAllCalendarEvents();
})

</script>

<template>
  <div class="flex flex-row bg-gray-100">
    <div class="basis-9/12">
      <EventCalendar :calendar-events="calendarEvents" />
    </div>
    <div class="basis-3/12">
      <EventList :calendar-events="calendarEvents" />
    </div>
  </div>
</template>

<style scoped>

</style>
