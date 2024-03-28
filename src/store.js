import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid';

function getRandomColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

export const calendarConfiguration = reactive({
  calendars: [],
  addCalendar() {
    this.calendars.push({
      id: uuidv4(),
      url: "",
      color: getRandomColor(),
    });
  },
  removeCalendar(index = 0) {
    this.calendars.splice(index, 1);
  },
  setCalendars(calendarArray) {
    this.calendars = calendarArray;
  },
})