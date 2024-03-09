<script setup>
import { ref, computed, onMounted } from 'vue';
import { add, sub, min, max, setDefaultOptions, format, isToday, eachDayOfInterval, startOfDay, startOfWeek, isThisMonth } from "date-fns";
import { de } from "date-fns/locale";

setDefaultOptions({ weekStartsOn: 1 , locale: de})

const props = defineProps({calendarEvents: {type: Array, default: Array}});

const debug = false;

const daysToDisplay = ref([]);
const relevantEvents = computed(() => {
  let events = {};
  let s = min(daysToDisplay.value);
  let e = max(daysToDisplay.value);

  props.calendarEvents.forEach((event) => {
    if (event.endDate >= s && event.startDate <= e) {
      let d = startOfDay(event.startDate);
      if (d in events) {
        events[d].push(event);
      } else {
        events[d] = [event];
      }
    }
  });

  return events;
});

let pointer = new Date();

function getTileStyle(day) {
  return {
    'bg-slate-100 text-slate-500': (!isThisMonth(day)),
    'bg-amber-100': isToday(day),
  }
}

function setCalendar() {
  daysToDisplay.value = [];

  let start = startOfWeek(pointer);
  let end = add(start, {days: 34})
  daysToDisplay.value = eachDayOfInterval({start: start, end: end})
}

function prevMonth() {
  pointer = sub(pointer, {months: 1});
  setCalendar();
}

function nextMonth() {
  pointer = add(pointer, {months: 1});
  setCalendar();
}

function prevWeek() {
  pointer = sub(pointer, {weeks: 1});
  setCalendar();
}

function nextWeek() {
  pointer = add(pointer, {weeks: 1});
  setCalendar();
}

function reset() {
  pointer = new Date();
  setCalendar();
}

onMounted(() => {
  setCalendar();
})

</script>

<template>
  <router-link
    :to="{name: 'conf'}"
    class="fixed bottom-2 left-2 bg-white h-10 w-10 z-10 flex justify-center items-center rounded shadow"
  >
    <div class="static">
      &#9881;&#65039;
    </div>
  </router-link>

  <div class="h-screen py-4 pl-4">
    <div
      v-if="debug"
      class="mb-2 flex justify-center gap-2"
    >
      <button
        class="rounded px-2 py-1 bg-white shadow"
        @click="prevMonth()"
      >
        &lt;&lt; month
      </button>
      <button
        class="rounded px-2 py-1 bg-white shadow"
        @click="prevWeek()"
      >
        &lt;&lt; week
      </button>
      <button
        class="rounded px-2 py-1 bg-white shadow"
        @click="reset()"
      >
        RESET
      </button>
      <button
        class="rounded px-2 py-1 bg-white shadow"
        @click="nextWeek()"
      >
        week >>
      </button>
      <button
        class="rounded px-2 py-1 bg-white shadow"
        @click="nextMonth()"
      >
        month >>
      </button>
    </div>
    <div class="h-full bg-white rounded drop-shadow">
      <div class="h-full flex flex-col divide-y">
        <!-- week header -->
        <div class="grid grid-cols-7 divide-x">
          <div
            v-for="day in daysToDisplay.slice(0,7)"
            :key="day"
            class="px-2"
          >
            <p class="font-bold">
              {{ format(day, 'EEEE') }}
            </p>
          </div>
        </div>

        <div
          v-for="week in 5"
          :key="week"
          class="grid grid-cols-7 grow divide-x"
        >
          <div
            v-for="day in daysToDisplay.slice((week-1)*7, 7+((week-1)*7))"
            :key="day"
            :class="getTileStyle(day)"
          >
            <p
              :class="{'font-bold': isToday(day)}"
              class="p-2"
            >
              {{ format(day, 'd. MMMM') }}
            </p>
            <p
              v-for="event in relevantEvents[startOfDay(day)]"
              :key="event.uid"
              class="rounded-md mx-1 mb-2 px-1 text-nowrap truncate font-semibold text-black"
              :style="'background-color: '+event.color+';'"
            >
              {{ event.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
