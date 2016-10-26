# PubCal

## What we are going to build

We are going to build a web app as a public repository of calendars. 
Users can publish their calendars by uploading files, importing from Google Calendar or creating them directly on our web app.
Users can search for calendars published by other users based on dates, calendar names, and locations.
Users can also rate existing calendars, and information generated from these ratings will be processed to help us recommend calendars to these users.
Users can receive browser-notifications or emails when their subscribed calendars get updated.

## Who are our target users

### User 1: Ivan (Publisher)
  * Age: 21
  * Occupation: Student at UCSD
  * Status: Single
  * Tech: VB.NET
  * Bio: Ivan is in his senior year with double majors in Political Science and Cognitive Science.
    He is also the president of the history and philosophy club, and he organizes public events regularly.
    He sometimes finds himself in a situation where he needs to delay an event because the original 
    location of the event becomes unavailable, or he needs to change the time of the event due to emergencies. 
    He has to notify all the club members about the location and time changes via emails, but some members will 
    miss those emails.
  * Goals: He wants to inform club members of the latest time and location of events

### User 2: Amanda (Subscriber)
  * Age: 22
  * Occupation: Nomad
  * Status: Single
  * Tech: Web Design
  * Bio: Amanda made a life-long decision to visit all countries in the world. 
    Usually she changes her place of residence every 6 months. It's important for her to keep track of all public
    holidays in the new country. Last time she had to stay hungry for the whole day because it 
    was a special holiday in Spain and all the shops were closed. Also, it's nice to see different festivals 
    and art galleries in the new city. 
  * Goals: She wants an easy way to find recurring events that are happening at some locations and keep track of them. 
    She also wants a simple way to organize all events in her personal calendar which she also uses for work.

### User 3: Kira (Subscriber)
  * Age: 22
  * Occupation: Student
  * Status: Single
  * Bio: A big NHL fan, who follows Maple Leafs team.
  * Goals: Kira wants to monitor schedules of all the games with Maple Leafs inside her own Google Calendar. 
  She doesn't want to manually update her NHL calendar if some changes in the game schedule occur such as a certain 
  game being cancelled or moving to another date.  
  
## Why users should choose our product
In our modern society, people often forget or don’t know what events are happening simply 
because there are just so much going on around them. People stared to utilize their 
electronic calendars to remind them what their schedule is like and what they need to do next.  
However it is often irritating to add events to their calendars. Our 
PubCal comes to rescue. PubCal allows organizations, communities, and various groups to 
add their own calendars to a centralized repository so that users can save their time of manually typing them up. 
Users can also create their own personal calendars to share them to their friends and families, or even strangers.  
Users don’t have to worry about changes in the calendars they subscribe to because of our update system.
Moreover our app not only allows users to keep track of what is going on in life, but also allows them to explore 
different events going on in their local communities. PubCal connects communities and bring people closer 
more than ever.

Decision designs we made:

1. An alternative we considered was implementing our application on the Google calendar or the Apple calendar. 
However it would be really hard to implement some of the features we have, and we cannot assure the privacy 
of our users. Therefore we have decided to set up PulCal by creating our own website rather than on a third party platform.

2. We also decided that calendar owners can give permission to certain people to edit their calendars.  
This would make it convenient for businesses to have more than one person in the marketing team to edit the 
calendar.