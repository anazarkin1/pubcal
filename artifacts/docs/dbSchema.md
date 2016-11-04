
Users: {

    _id: INTEGER,
    
    username: STRING,
    
    password: STRING,
    
    email: STRING
    
    subscribed_to: [url1,url2,...,urln](reference?)

}

Calendars: {

    name: STRING
    
    description: STRING
    
    tags: [tag1,tag2,...,tagn](reference?)
    
    url: STRING
    
    filepath: STRING
    
    created_by: STRING
    
    created_at: TIMESTAMP
    
    updated_at: TIMESTAMP
    
    users_subscribed:[user1,user2,...,usern](REFERENCE?)
    
    events: [
                {
                "name": STRING,
                "description": STRING,
                "start": DATE, 
                "end": DATE, 
                "location": STRING,
                "allDay": BOOLEAN,
                "repeating":{
                                freq: STRING,
                                count: NUMBER,
                                interval: NUMBER,
                                until: DATE,
                                byDay: [STRING], 
                                byMonth: [NUMBER], 
                                byMonthDay: [NUMBER]
                             }
                            
                
                
                },
         {}...]
    
}
