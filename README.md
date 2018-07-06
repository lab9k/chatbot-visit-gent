# Chatbot Gentse Feesten

This chatbot has the following functionalities:
* Show all Gentse Feesten squares
* Show events for specific square at specific date
* Show events that are happening now
* Find the closest toilet
* Ask feedback to the user

## Get started

### 1.Dialogflow

Dialogflow is a platform from google that regulates the flow of your conversation which 
gives users new ways to interact with your product by building engaging voice and text-based conversational interfaces, such as voice apps and chatbots, powered by AI. Connect with users on your website, mobile app, the Google Assistant, Amazon Alexa, Facebook Messenger, and other popular platforms and devices."

Source: [dialogflow.com](https://dialogflow.com/)

Dialogflow concepts:
1. [Intents: Know what your users want](https://www.youtube.com/watch?v=9aHusGxntPw)
2. [Entities: Identify things your users mention](https://www.youtube.com/watch?v=kzdL6GxJ_WY)
3. [Dialog Control: Shape the flow of your conversation](https://www.youtube.com/watch?v=-tOamKtmxdY)

#### 1.1.Connect with Facebook Messenger

Step 1:
[Tutorial on how to connect dialogflow with messenger](https://www.youtube.com/watch?v=-2hE3YHsuBQ)

Step 2:
* Create your facebook page
* Visit your facebook page as admin
* Go to "Settings"
* Then click "Messenger Platform" 
* Change the role of your chatbot to "primary receiver"

IMPORTANT SIDENOTE: During development only the admin and testers can use the chatbot, to add testers go to "Roles",
To make the chatbot public, go to "App Review" and submit your chatbot.

### 2.CosmosDB

this non-relational database from Microsoft is used to store the feedback of the chatbot.
We use the NPM 'Mongoose' package to connect with the database.

1.Connect with database
```
mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(
        () => {
            console.log("connected to DB")
        },
        err => {
            console.log(err)
        }
);
```

2.Add feedback to database
```
Feedback.create({ _id: new mongoose.Types.ObjectId() , satisfaction: satisfaction, feedbackImprovement: feedbackImprovement }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("feedback saved")
        }
    });
```

# SPARQL

Sparql is an RDF query language, that is, a semantic query language for databases, able to retrieve and manipulate data stored in Resource Description Framework (RDF) format.

We used the following 2 Sparql queries to get the events of "Gentse Feesten":

1.Get all events from Gentse Feesten now
```
    SELECT ?eventName ?startDate ?endDate ?description from <http://stad.gent/gentse-feesten-2018/> WHERE {
        ?sub a <http://schema.org/Event> .
        ?sub <http://schema.org/name> ?eventName.
        ?sub <http://schema.org/description> ?description.
        ?sub <http://schema.org/startDate> ?startDate.
        ?sub <http://schema.org/endDate> ?endDate.
        ?sub <http://schema.org/location> ?location.
        ?location <http://schema.org/address> ?address. 
        ?address <http://schema.org/streetAddress> ?streetAddress.
        ?location <http://schema.org/address> ?name. 
        FILTER ((?startDate >= ${date}^^xsd:dateTime && ?endDate < ${date}^^xsd:dateTime))
    }
```

2.Get events from Gentse Feesten specific date and square

```
SELECT ?eventName ?startDate ?endDate ?description from <http://stad.gent/gentse-feesten-2018/> WHERE {
        ?sub a <http://schema.org/Event> .
        ?sub <http://schema.org/name> ?eventName.
        ?sub <http://schema.org/description> ?description.
        ?sub <http://schema.org/startDate> ?startDate.
        ?sub <http://schema.org/endDate> ?endDate.
        ?sub <http://schema.org/location> ?location.
        ?location <http://schema.org/address> ?address. 
        ?address <http://schema.org/streetAddress> ?streetAddress.
        ?location <http://schema.org/address> ?name. 
        FILTER ((contains(lcase(STR(?streetAddress)), ${stageName}) || contains(lcase(STR(?name)), ${stageName})) && (?startDate >= ${convertedDate}^^xsd:dateTime && ?endDate < ${convertedDate}^^xsd:dateTime))
    }
```


