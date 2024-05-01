# ics-kiosk

Lightweight client side web app to display customizable ics subscriptions on a kiosk monitor.

![image](https://github.com/fechnert/ics-kiosk/assets/1409863/70651cb5-ef1a-4432-b644-fa8017db1708)



# Features

- Subscribe to multiple `*.ics` feeds
- Shows events summarized in calendar view
- Shows event details in list view on the side
- Share configuration via link
- Kiosk ready, show on screens without input devices
- Host it yourself, you just need to serve the staticfiles
- No serverside application required, requests directly made to the ICS feeds


# Caveats

You have to handle CORS policy issues yourself. Either host your own CORS proxy or try to set the proper headers on the ICS source (if possible). I'm using this project so show ICS feeds coming from a hosted nextcloud instance, where it is possible to install apps like [WebAppPassword](https://apps.nextcloud.com/apps/webapppassword) to add allowed hosts.


# What's yet to come

### Todo

- [x] Improve styles of calendar view
- [x] Improve styles of list view
- [x] Support multiple calendars
- [x] Reload calendar data regularily
- [x] Make calendars configurable (color, url)
- [x] Make configured calendars shareable via simple URL
- [x] Update Calendar view on day change
- [x] Show times in list view
- [ ] Highlight current events in list view

### Nice to have

- [ ] Persist current calendar configuration to browser
- [ ] Configurable reload interval per calendar
- [ ] Better i18n support

### Known bugs to fix

- [x] Show events of the current week before the current day again
- [ ] Show events accross multiple days in calendar view
- [ ] Find a nicer color for the current day highlight
