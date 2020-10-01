# Scheduler
<p align=center>
  <img src='https://img.shields.io/github/issues/bhagwatgarg/scheduler-backend'>
  <img src='https://img.shields.io/github/forks/bhagwatgarg/scheduler-backend'>
  <img src='https://img.shields.io/github/stars/bhagwatgarg/scheduler-backend'>
</p>
<h1 align="center">
  <br>
  <img src="https://github.com/bhagwatgarg/scheduler-frontend/blob/master/public/favicon.png?raw=true" alt="Scheduler" width="160">
</h1>

<h4 align="center">A web app to manage all your calendars in one place.</h4>

For more info about the app, visit the frontend repo [here](https://github.com/bhagwatgarg/scheduler-frontend).

## Routes
### Events
```
Endpoint : /events/:id
Method : PATCH
Authorization Required

Response: Updated Event (if request succeeds)
Response Code Meanings:
202 - accepted
401 - unauthorized
404 - event not found
```
```
Endpoint : /events/:id
Method : DELETE
Authorization Required

Response: Deleted Event (if request succeeds)
Response Code Meanings:
200 - ok
401 - unauthorized
404 - event not found
```
```
Endpoint : /events/new
Method : POST
Authorization Required

Response: Created Event (if request succeeds)
Response Code Meanings:
201 - created
406 - input not acceptable
401 - unauthorized
404 - user not found
```

### Users
```
Endpoint : /users/signup
Method : POST
Authorization Not Required

Response: Created User (if request succeeds)
Response Code Meanings:
201 - created
406 - user already exists
```
```
Endpoint : /users/login
Method : POST
Authorization Not Required

Response: Created User (if request succeeds)
Response Code Meanings:
200 - user data
404 - invalid credentials
```
```
Endpoint : /users/get/:name
Method : GET
Authorization Required

Response: Users (if request succeeds)
Response Code Meanings:
200 - ok
```
```
Endpoint : /users/follow
Method : POST
Authorization Required

Response: Channel Data (if request succeeds)
Response Code Meanings:
200 - ok
403 - user already following the channel
404 - user/channel not found
```
```
Endpoint : /users/unfollow
Method : POST
Authorization Required

Response: Channel Data (if request succeeds)
Response Code Meanings:
200 - ok
403 - user is not following the channel
404 - user/channel not found
```
```
Endpoint : /users/:id
Method : GET
Authorization Required

Response: User Data (if request succeeds)
Response Code Meanings:
200 - ok
```
```
Endpoint : /users/events/:id
Method : GET
Authorization Required

Response: User's Event Data (if request succeeds)
Response Code Meanings:
200 - ok
404 - user/channel not found
```