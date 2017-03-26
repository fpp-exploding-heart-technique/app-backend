## API
### /events
* / (GET)
  Get a list of events.
  Optional arguments:
  ** start (String of timestamp), end (String of timestamp): if both given, get events intersecting given time interval.
  ** type ([String]): get events that has one of these types
  ** loc (GeoJSON Point), radius (Number, meters): get events around the given point in given radius. if radius is not specified, it is 1000 by default.
  Elements of the result array have the following format:
  ```javascript
  {
        "location": "<lat>,<lon>",
        "title": "<title>",
        "description": "<description>",
        "owner": "<owner>",
        "type": "<type>"
  }
  ```
* / (POST)
  Create new event. 
  Post data must be in the following format:
  ```javascript
  {
    "start": <start timestamp>,
    "end": <start timestamp>,
    "loc": "<lat>,<lon>",
    "type": "<type>",
    "title": "<title>",
    "desc": "<description>",
    "owner": "<owner id>"
  }
  ```
  Restrictions:
  ** title (String): Event title. Titles longer than 50 characters are truncated
  ** desription (String): Event description. Descriptions longer than 1500 characters are truncated.
  ** type (String): Event type. Event type must be one of these: Eğlence, Tarih, Kültür, Sanat, Spor, Doğa.

* /:id (GET)        GET       Get event by id
  Get complete information of an event. Result has the following format:
  ```javascript
  {
    "_id": "<event id>",
    "description": "<event description>",
    "owner": "<owner id>",
    "type": "<event type>",
    "requests": <list of user ids requested to attend>,
    "attendees": <list of user ids of attendees>,
    "location": "<lat>,<lon>",
    "__v": <version number>
  }
  ```

* /:id            PUT       Update event
  Update the specified event. Post data must have the following format:
  ```javascript
  {
    ["owner" : "<owner id>"]
    ["eventId":"<event id>"]
    ["desc" : "<event description>"]
    ["type" : "<event type>"]
  }
  ```
* /attendReq (POST)
  Add an attending request to specified event. Post data must have the following format:
  ```javascript
  {
    "userId": <user id>,
    "eventId": "<event id>"
  }
  ```
* /addAttendee (POST)
  Reject a request or add attendee to specified event. Post data must have the following format:
  ```javascript
  {
    "userId": <user id>,
    "eventId": "<event id>",
    "confirm": (true|false)
  }
  ```
  if "confirm" is true, attendee will be added
  otherwise, "userId" will be removed from requests.
  
* /initdb (GET)
  Drop collection.
