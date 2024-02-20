<script setup>
import { ref, computed, onMounted } from 'vue';
import { add, sub, min, max, setDefaultOptions, addDays, format, isToday, eachDayOfInterval, startOfDay, startOfWeek, startOfMonth, getWeekOfMonth, getWeeksInMonth, isFirstDayOfMonth, isLastDayOfMonth, isMonday } from "date-fns";
import { de } from "date-fns/locale";

setDefaultOptions({ weekStartsOn: 1 })

const daysToDisplay = ref([]);
const props = defineProps(['v_events']);
const allEvents = ref(props.v_events);

const relevantEvents = computed(() => {
  let events = {};
  let s = min(daysToDisplay.value);
  let e = max(daysToDisplay.value);
  allEvents.value.forEach((event) => {
    if (event.endDate >= s && event.startDate <= e) {
      let d = startOfDay(event.startDate);
      if (d in events) {
        events[d].push(event);
      } else {
        events[d] = [event];
      }
    }
  })
  return events;
});

let pointer = new Date();

function getBorder(day) {
  return {
    'border-b-2 border-b-black': (getWeekOfMonth(day) === getWeeksInMonth(day)),
    'border-t-2 border-t-black': (getWeekOfMonth(day) === 1 && !isMonday(startOfMonth(day))),
    'border-l-2 border-l-black': (isFirstDayOfMonth(day) && !isMonday(day)),
    'border-r-0': (isLastDayOfMonth(day)),
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

onMounted(() => {
  setCalendar();
})

</script>

<template>

  <div class="h-screen flex flex-col divide-y">

    <!-- temp manipulate -->
    <div>
      <p>
        <button @click="prevMonth()"> << Prev </button>
        <span>Month</span>
        <button @click="nextMonth()"> Next >> </button>
      </p>
      <p>
        <button @click="prevWeek()"> << Prev </button>
        <span>Week</span>
        <button @click="nextWeek()"> Next >> </button>
      </p>
    </div>

    <!-- week header -->
    <div class="grid grid-cols-7 divide-x">
      <div v-for="day in daysToDisplay.slice(0,7)" class="px-2">
        <p class="font-bold">{{ format(day, 'E', {locale: de}) }}</p>
      </div>
    </div>

    <!-- weeks -->
    <div class="grid grid-cols-7 grow divide-x">
      <div v-for="day in daysToDisplay" class="border-b" :class="getBorder(day)">
        <p :class="{'font-bold': isToday(day)}" class="p-2">
          {{ format(day, 'd. MMMM', {locale: de}) }}
        </p>
        <p v-for="event in relevantEvents[startOfDay(day)]" class="bg-red-400 rounded-md mx-1 mb-2 px-1">
          {{ event.title }}
        </p>
      </div>
    </div>

  </div>

  <div>
    <pre>{{ relevantEvents }}</pre>
  </div>

</template>
