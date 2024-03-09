<script setup>
import { ref, onMounted } from 'vue';

import * as ICAL from "ical.js";
import { add } from 'date-fns';

import { calendarConfiguration } from '@/store';

import EventCalendar from "@/components/EventCalendar.vue";
import EventList from "@/components/EventList.vue";

const calendarEvents = ref([]);

function getAllCalendarEvents() {
  let now = new Date();
  let end = add(now, {months: 3})

  calendarEvents.value = [];
  calendarConfiguration.calendars.forEach((calConf) => {
    fetch(calConf.url).then(async (response) => {

      let rawContent = await response.text();
      let jCal = ICAL.parse(rawContent);
      let comp = new ICAL.Component(jCal);
      let vEvents = comp.getAllSubcomponents("vevent");

      vEvents.forEach((vEvent) => {
        let event = new ICAL.Event(vEvent);
        if (event.startDate.toJSDate() <= end && event.endDate.toJSDate() >= now) {
          calendarEvents.value.push({
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
  <div class="flex flex-row">
    <div class="basis-9/12">
      <EventCalendar :calendar-events="calendarEvents" />
    </div>
    <div class="basis-3/12">
      <EventList :calendar-events="calendarEvents" />
    </div>
  </div>
</template>