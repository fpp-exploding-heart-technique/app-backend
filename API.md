## API
### /events
* `/ (GET)` :
  Get a list of events.
  Optional arguments:
  ** `start` (String of timestamp), end (String of timestamp): if both given, get events intersecting given time interval.
  ** `type` ([String]): get events that has one of these types
  ** `loc` (GeoJSON Point), `radius` (Number, meters): get events around the given point in given radius. if radius is not specified, it is 1000 by default.
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
* `/ (POST)` :
  Create new event. 
  Post data must have the following format:
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
  ** `title` (String): Event title. Titles longer than 50 characters are truncated
  ** `desription` (String): Event description. Descriptions longer than 1500 characters are truncated.
  ** `type` (String): Event type. Event type must be one of these: Eğlence, Tarih, Kültür, Sanat, Spor, Doğa.

* `/:id (GET)` :
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

* `/:id (PUT)` :
  Update the specified event. Post data must have the following format:
  ```javascript
  {
    ["owner" : "<owner id>"]
    ["eventId":"<event id>"]
    ["desc" : "<event description>"]
    ["type" : "<event type>"]
  }
  ```
* `/attendReq (POST)` :
  Add an attending request to specified event. Post data must have the following format:
  ```javascript
  {
    "userId": <user id>,
    "eventId": "<event id>"
  }
  ```
* `/addAttendee (POST)` :
  Reject a request or add attendee to specified event. Post data must have the following format:
  ```javascript
  {
    "userId": <user id>,
    "eventId": "<event id>",
    "confirm": (true|false)
  }
  ```
  if `confirm` is true, `userId` will be added to `attendees` of the event.
  otherwise, `userId` will be removed from `requests`.
  
* `/initdb (GET)` :
  Drop collection.

### /users
* `/checkin (POST)` :
  Create new user if it is the first time. 
  Post data must have the following format:
  ```javascript
  {
    "facebook":"<facebook user id>",
    "name":"<name>"
  }
  ```
  
* `/:id (GET)` :
  Get facebook user id and name of a user with given facebook id. Result has the following format:
  ```javascript
  {
    "_id": <id in database>
    "facebook":"<facebook user id>",
    "name":"<user name>"
    "_v": <version number>
  }
  ```
  
* `/initdb (GET)` :
  Drop collection.

### /pois
* `/ (GET)` :
  Get a list of POIs.
  Optional arguments:
  ** `loc` (pair of lat,lon in String), `radius` (Number, meters): get events around the given point in given radius. if radius is not specified, it is 1000 by default.
  Elements of the result array have the following format:
  ```javascript
  {
        "name": "<name of the POI">,
        "location": "<lat>,<lon>",
        "description": "<description>",
  }
  ```
* `/ (POST)` :
  Create new POI. 
  Post data must have the following format:
  ```javascript
  {
    "loc": "<lat>,<lon>",
    "name": "<name of the POI>",
    "desc": "<description>"
  }
  ```
  Restrictions:
  ** `title` (String): Event title. Titles longer than 30 characters are truncated
  ** `desription` (String): Event description. Descriptions longer than 1500 characters are truncated.

* `/:id (GET)` :
  Get complete information of a POI. Result has the following format:
  ```javascript
  {
    "_id": "<POI id>",
    "name": "<POI name>"
    "description": "<event description>",
    "location": "<lat>,<lon>",
    "__v": <version number>
  }
  ```
  
* `/initdb (GET)` :
  Drop collection.
