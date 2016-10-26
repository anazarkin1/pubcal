# PubCal

## Iteration 01 - Review & Retrospect

 * When: Sun, OCT 23, 4pm
 * Where: BA3200

## Process - Reflection

Decisions turned out well:

 * We chose Slack for team communication because it was easy to share resources with members. 
 It also allowed us to create polls when we
   had to make decisions such as meeting time and location.
 * We chose Github project page as out to-do list. 
 It was very useful because it gave us a clear view of whether a certain task is needed to be done, in progress, or completed.  
 * We chose Balsamiq to draw mockups because it was very convenient to work on mockup designs.


Decisions did not turn out as well as you hoped:

 * The roles we have assigned to each member are too general/broad. (see the plan md file)
 * Although we agreed to meet three times a week to discuss our progress, we only met twice a week at most. (see the plan md file)
 * We planned to have an online group meeting at the end of each week but it never happened.

We are planning to make the following changes to our process:

 * Instead of having scheduled group meetings for the next few weeks, we agreed to decide on the time and location of the next meetings only. 
 Since everybody has a different schedule, it was hard to stick with the scheduled meeting time. We agreed that it would be more efficient 
 to decide on our next meeting each time we meet, instead of having a set of dates for future meetings.  
 * As mentioned in the previous section, we decided not to have any online group meetings because we think it's better to have a 
 face-to-face meeting for a more efficient discussion. 
 * We will assign more specific roles and responsibilities to each member.


## Product - Review

Goals/tasks that were met/completed:

 * Created wireframes various pages.

1. Index page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/Front%20page.png?token=AQ23kONsyhsQOwX6M3nSGP1lE_RGaNnxks5YGX-8wA%3D%3D)

2. Signup page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/Signup.png?token=AQ23kJHGb6OGt0moQAfBKJrMSGGVdjRRks5YGX_KwA%3D%3D)

3. Login page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/Login.png?token=AQ23kEXb5rLtexUicfV4J-WALF0lI7F-ks5YGX--wA%3D%3D)

4. Login with third party authentications
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/LoginWithOptions.png?token=AQ23kPDGph6WpNmSsVlgK7LGwWCBdACCks5YGX_BwA%3D%3D)

5. Add Calendar page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/AddCalendar.png?token=AQ23kLWU7lKWAJ7AIDlm7wfUAy6BaYaYks5YGX-0wA%3D%3D)

6. Detailed Calendar page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/Calendar%20Page.png?token=AQ23kJdVjzhMAWy0UeYeRYCQ7cA5SBpOks5YGX-3wA%3D%3D)

7. Created Calendars page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/Created%20calendar.png?token=AQ23kHiQ76sjo77Z4QClu1UJSIL_0OqJks5YGX-6wA%3D%3D)

8. Account page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/Account%20settings.png?token=AQ23kNbq6LNmcCnmt-9VfkEL2W30s0zfks5YGX9SwA%3D%3D)

9. Search Results page
![alt tag](https://raw.githubusercontent.com/csc301-fall-2016/project-team-18/master/artifacts/Search%20result.png?token=AQ23kEX3Wg8nE5CBOsocUG3lmvtCtcasks5YGX_HwA%3D%3D)

* Wrote up basic MongoDB model:

Users: {

    _id: #####,
    
    username: ###
    
    password: ###
    
    email: ###@###.##
    
    subscribed_to: [url1,url2,...,urln](reference?)

}

Calendars: {

    name: ###
    
    description: ####
    
    tags: [tag1,tag2,...,tagn](reference?)
    
    url: #####.####
    
    filepath: ####
    
    created_by: ####(ref)
    
    created_at: ####
    
    updated_at: ####
    
    users_subscribed:[user1,user2,...,usern]
    
    events: [{"name":"","description":"","start-date":"", "end-date":"", "location":""}, {}...]
    
}

Goals/tasks that were planned but not met/completed:

 1. We were not able to complete UML diagrams. We did not have enough time to do UML diagrams (and to come up with technical detail needed for UML diagrams). 
 2. We did not do the interactive mockups because we believe it is redundant if we already have wireframes.
   
Goals/tasks that were not originally planned, but ended up being met/completed:

 1. Task: (code) node + express + mongo set up with basic MVC architecture in an AWS server at ip addr 52.205.254.60 (see pubcal in root directory)
 2. The reason to add and complete this task is because we have already chosen the stack we will be
    working with for the next iteration, next basic environment set up would be change dramatically 
    even if we change our designs. It is therefore in our best interest to complete this part ahead
    of time in order to focus on more important task during the next iteration.


Going into the next iteration, our main insights are:

1. We should adhere to agile methodologies closer and be able to change our approaches as we progress (if we figure one approach does not work).
2. We should prioritize our features since we have limited time and resources. We should be able to remove extra feature if necessary.
