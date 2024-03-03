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

function removeCalendar(index) {
  calendarEvents.value[calendarConfiguration.value[index].url] = [];
  calendarConfiguration.value.splice(index, 1);
  getAllCalendarEvents();
}

function addCalendar() {
  calendarConfiguration.value.push({
    url: "",
    order: 0,
    color: "#000000",
    updateInterval: 300,
    lastUpdate: null,
  })
}


onMounted(() => {
  getAllCalendarEvents();
})

</script>

<template>
  <!-- calendar configuration -->
  <div class="bg-gray-100">
    <div class="pt-4 ">
      <div class="bg-white rounded shadow mx-4 px-2 py-2">
        <div
          v-for="(conf, index) in calendarConfiguration"
          :key="conf.url"
          class="flex gap-4 mb-4"
        >
          <div>
            <input
              :id="'color-' + index"
              v-model="conf.color"
              type="color"
              class="invisible h-0 w-0"
            >
            <label
              :for="'color-' + index"
              class="w-16 h-full inline-block rounded border shadow"
              :style="'background-color: ' + conf.color + ';'"
            />
          </div>
          <div class="grow">
            <input
              v-model="conf.url"
              type="text"
              class="border rounded shadow px-2 truncate w-full"
            >
          </div>
          <!-- <div><input type="number" v-model="conf.updateInterval" class="border rounded shadow px-2 w-fit"></div> -->
          <div>
            <button
              class="border rounded shadow block"
              @click="removeCalendar(index)"
            >
              &#128465;
            </button>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded border shadow font-semibold"
            @click="getAllCalendarEvents()"
          >
            Save & Reload
          </button>
          <button
            class="px-4 py-2 rounded border shadow font-semibold"
            @click="addCalendar()"
          >
            &#10133; Add Calendar
          </button>
        </div>
      </div>
    </div>

    <!-- calendar & list view -->
    <div class="flex flex-row">
      <div class="basis-9/12">
        <EventCalendar :calendar-events="calendarEvents" />
      </div>
      <div class="basis-3/12">
        <EventList :calendar-events="calendarEvents" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
