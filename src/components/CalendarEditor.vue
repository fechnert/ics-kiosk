<script setup>

import { computed } from 'vue';

import { calendarConfiguration } from '@/store';

const shareURL = computed(() => {

  if (!calendarConfiguration.calendars.length) {
    return "";
  }

  let encodedCalendarConf = btoa(JSON.stringify(calendarConfiguration.calendars));
  let loadPath = "/#/load/"
  let fullURL = window.location.origin + loadPath + encodedCalendarConf;

  return fullURL;
});

</script>

<template>
  <div class="pt-4 ">
    <div class="bg-white rounded shadow mx-4 px-2 py-2">
      <div
        v-for="(conf, index) in calendarConfiguration.calendars"
        :key="conf"
        class="flex gap-2 mb-4"
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
            class="w-10 h-full inline-block rounded border shadow"
            :style="'background-color: ' + conf.color + ';'"
          />
        </div>
        <div class="grow">
          <input
            v-model="conf.url"
            type="text"
            class="border rounded shadow px-2 truncate w-full h-10"
          >
        </div>
        <!-- <div><input type="number" v-model="conf.updateInterval" class="border rounded shadow px-2 w-fit"></div> -->
        <div>
          <button
            class="border rounded shadow block h-10 w-10"
            @click="calendarConfiguration.removeCalendar(index)"
          >
            &#128465;
          </button>
        </div>
      </div>
      <div class="flex gap-2">
        <router-link
          class="px-4 py-2 rounded border shadow font-semibold"
          :to="{name: 'calendar'}"
        >
          &#128190; Save
        </router-link>
        <button
          class="px-4 py-2 rounded border shadow font-semibold"
          @click="calendarConfiguration.addCalendar()"
        >
          &#10133; Add Calendar
        </button>
        <input
          v-model="shareURL"
          type="text"
          class="border rounded shadow px-2 truncate grow"
          placeholder="Nothing to share yet ..."
          readonly
        >
      </div>
    </div>
  </div>
</template>