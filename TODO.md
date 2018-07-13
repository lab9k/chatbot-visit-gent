# todo

## Dialogflow

- Toiletten
- Opslaan coördinaten(?)
- Intents voor tijdsgebonden verzoek
- Overzicht locaties + wat er te doen is.
- Feedback
- fix samengestelde locatie namen(bv. beverhoutplein)
- optie toiletten voor vrouwen

## Api

- Tijdsgebonden filteren.
- Overzicht locaties + wat er te doen is.
- Feedback opslaan (?)

#### workflow api

1.  Nieuw intent in Dialogflow
2.  Voeg action toe aan de intent.
3.  In middleware.js, voeg een switch case toe met de naam van de action

```javascript
  case '<action_naam>':
    req.type = '<type>';
    break;
```

4.  in /routes/gf/index.js, nieuwe switch op het type action.

```javascript
  case '<type>':
    fn = functienaam;
    break;
```

5.  nieuwe handler in routes/gf/index.js

```javascript
const functienaam = (req, res, next) => {};
```

6.  Event en Locatie data zijn beschikbaar voor het opstarten van de server. (in gf/index.js: eventMapper.events en locationMapper.getSquares())
7.  filter en map je data tot je hebt wat je moet hebben.
8.  Gebruik de Card en Button models om je responseData op te bouwen.
9.  De structuur van de responseData is heel specifiek, bekijk de voorbeelden in de functies die al af zijn.
