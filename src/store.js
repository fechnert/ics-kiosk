import { reactive } from 'vue'

function getRandomColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

export const calendarConfiguration = reactive({
  calendars: [],
  addCalendar() {
    this.calendars.push({
      url: "",
      order: 0,
      color: getRandomColor(),
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