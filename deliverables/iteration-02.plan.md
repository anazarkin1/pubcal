# PubCal


## Iteration 01 - Planning

* Start date: Sun Oct 30
* End date: Sun Oct 13 

## Process


#### Roles & responsibilities

* Frontend: Barry, Navie
* Backend: Eddie,Alex and Nathan


#### Events

* Meeting 1
* Time and location: Sun, Oct 30, 3:30 - 4pm, BA3200
* Format: in person
* Purpose: discuss the goals and tasks


#### Artifacts


## Product

#### Goals and tasks:

1. front end layout (navie + barry)
2. create/remove/edit calendars (alex)
3. log in/log out (eddie)
4. import calendars (eddie)
5. search calendars (nathan
6. fake data in database (nathan)
7. make a video 



#### Artifacts

1. video
2. web app
K
Users: {

    _id: #####,
    
    username: ###
    
    password: ###
    
    email: ###@###.##
    
    subscribed_to: [id1, id2 ...](reference?)

}

Calendars: {

    name: ###
    
    description: #### (255)
    
    tags: [tag1,tag2,...,tagn]
    
    url: #####.####
    
    filepath: iCal format
    
    created_by: user_id
    
    created_at: date
    
    updated_at: date
    
    users_subscribed:[user1,user2,...,usern]
    
    events: [{"name":"","description":"","start-date":"", "end-date":"", "location":"", repeat}, {}...]
    
}

