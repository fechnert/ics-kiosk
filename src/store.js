import { reactive } from 'vue'

export const calendarConfiguration = reactive({
  calendars: [],
  addCalendar() {
    this.calendars.push({
      url: "",
      order: 0,
      color: "#000000",
      updateInterval: 300,
      lastUpdate: null,
    });
  },
  removeCalendar(index = 0) {
    this.calendars.splice(index, 1);
  },
  setCalendars(calendarArray) {
    this.calendars = calendarArray;
  },
})