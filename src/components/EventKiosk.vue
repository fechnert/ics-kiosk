<script setup>
import { ref, onMounted } from 'vue';

import * as ICAL from "ical.js";
import { add } from 'date-fns';

import { calendarConfiguration } from '@/store';

import EventCalendar from "@/components/EventCalendar.vue";
import EventList from "@/components/EventList.vue";

const calendarEvents = ref([]);

function addCalendarEvent(now, end, event, startDate, endDate, color) {
  if (startDate.toJSDate() <= end && endDate.toJSDate() >= now) {
    calendarEvents.value.push({
      "uid": event.uid + "-" + startDate.toICALString(),
      "title": event.summary,
      "description": event.description,
      "startDate": startDate.toJSDate(),
      "endDate": endDate.toJSDate(),
      "color": color,
    })
  }
}

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

        addCalendarEvent(now, end, event, event.startDate, event.endDate, calConf.color);

        let rrule = vEvent.getFirstProperty('rrule');
        if (rrule) {
          let dtstart = vEvent.getFirstPropertyValue('dtstart')
          let iter = event.iterator(dtstart)
          for (let next = iter.next(); next && !iter.completed; next = iter.next()) {
            let subEvent = event.getOccurrenceDetails(next);
            addCalendarEvent(now, end, subEvent.item, subEvent.startDate, subEvent.endDate, calConf.color);
          }
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