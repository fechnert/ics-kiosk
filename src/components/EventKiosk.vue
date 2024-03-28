<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import * as ICAL from "ical.js";
import { add, startOfWeek} from 'date-fns';

import { calendarConfiguration } from '@/store';

import EventCalendar from "@/components/EventCalendar.vue";
import EventList from "@/components/EventList.vue";

const lastUpdate = ref();
const calendarEvents = ref({});
const globalEventList = computed(() => {
  let eventList = []
  Object.keys(calendarEvents.value).forEach(id => {
    eventList.push(...calendarEvents.value[id]);
  })
  return eventList;
});

watch(lastUpdate, () => {
  setTimeout(() => {
    lastUpdate.value = new Date();
    getAllCalendarEvents();
  }, 300 * 1000)
}, {immediate: true})

function getEventsOfSingleCalendar(calendar) {

  let start = startOfWeek(new Date());
  let end = add(start, {months: 3})

  fetch(calendar.url).then(async (response) => {

    let events = [];
    let rawContent = await response.text();
    let jCal = ICAL.parse(rawContent);
    let comp = new ICAL.Component(jCal);
    let vEvents = comp.getAllSubcomponents("vevent");

    // wait for all the events before overwriting the list
    await Promise.all(vEvents.map((vEvent) => {
      let event = new ICAL.Event(vEvent);

      addCalendarEvent(events, calendar, start, end, event, event.startDate, event.endDate);

      let rrule = vEvent.getFirstProperty('rrule');
      if (rrule) {
        let dtstart = vEvent.getFirstPropertyValue('dtstart')
        let iter = event.iterator(dtstart)
        for (let next = iter.next(); next && !iter.completed; next = iter.next()) {
          let subEvent = event.getOccurrenceDetails(next);
          addCalendarEvent(events, calendar, start, end, subEvent.item, subEvent.startDate, subEvent.endDate);
        }
      }
    }))

    calendarEvents.value[calendar.id] = events;

  })
}

function addCalendarEvent(events, calendar, start, end, event, startDate, endDate) {
  if (startDate.toJSDate() <= end && endDate.toJSDate() >= start) {
    events.push({
      "uid": event.uid + "-" + startDate.toICALString(),
      "title": event.summary,
      "description": event.description,
      "startDate": startDate.toJSDate(),
      "endDate": endDate.toJSDate(),
      "color": calendar.color,
    })
  }
}

function getAllCalendarEvents() {
  calendarConfiguration.calendars.forEach((calendar) => {
    getEventsOfSingleCalendar(calendar);
  })
}

onMounted(() => {
  getAllCalendarEvents();
})
</script>

<template>
  <div class="flex flex-row">
    <div class="basis-9/12">
      <EventCalendar :calendar-events="globalEventList" />
    </div>
    <div class="basis-3/12">
      <EventList :calendar-events="globalEventList" />
    </div>
  </div>
</template>