# Google Calendar Webhook setup

When someone books a call from zyphlabs.com, the Next.js `/api/book` route POSTs the booking to a Google Apps Script endpoint you deploy on your account. The Apps Script creates the event on **your** calendar and invites the attendee — no availability check, just book it.

## 1. Create a new Apps Script project

1. Open https://script.google.com → **New project** (or open an existing Zyph project).
2. Paste the code below into `Code.gs` and save.

```javascript
/**
 * Zyph Labs — calendar booking webhook.
 * Receives JSON from https://www.zyphlabs.com/api/book and creates a Google
 * Calendar event on the owner's default calendar. Invites the attendee.
 * No availability check — whatever the user picks, we book.
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const { title, startISO, endISO, description, attendeeEmail, attendeeName } = body;
    if (!title || !startISO || !endISO || !attendeeEmail) {
      return _json({ error: 'missing required fields' }, 400);
    }

    const cal = CalendarApp.getDefaultCalendar();  // your primary calendar
    const event = cal.createEvent(
      title,
      new Date(startISO),
      new Date(endISO),
      {
        description: description || '',
        guests: attendeeEmail,
        sendInvites: true,
      }
    );

    return _json({
      ok: true,
      eventId: event.getId(),
      htmlLink: 'https://calendar.google.com/calendar/u/0/r',
    });
  } catch (err) {
    return _json({ error: String(err) }, 500);
  }
}

function doGet() {
  return _json({ ok: true, endpoint: 'zyph-book', version: 1 });
}

function _json(obj, status) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 2. Deploy as a Web App

1. Click **Deploy** → **New deployment**.
2. Type: **Web app**.
3. Description: `Zyph booking webhook v1`.
4. Execute as: **Me (brian@solardev.ca)**.
5. Who has access: **Anyone**.
6. Click **Deploy**. First time, Google asks you to authorize calendar access — approve it.
7. Copy the **Web app URL** (something like `https://script.google.com/macros/s/AKfy.../exec`).

## 3. Add the URL to Vercel

1. Open https://vercel.com/solar-devs-projects/zyphlabs-website/settings/environment-variables.
2. Add env var: **Key:** `CALENDAR_WEBHOOK_URL`  **Value:** the URL from step 2.
3. Redeploy or wait for the next push.

## 4. Test it

Open https://www.zyphlabs.com/book/strategy, pick a time, submit. The event should appear on your calendar within seconds. The attendee gets a confirmation email plus a calendar invite.

## Notes

- The webhook has **no availability check** (per spec). Double-bookings are possible.
- If you need a different default calendar, swap `CalendarApp.getDefaultCalendar()` for `CalendarApp.getCalendarById('your-calendar-id@group.calendar.google.com')`.
- Reschedules still go through you manually — users email alex@zyphlabs.com to change a time.
