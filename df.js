// const fs = require('fs');
// const pump = require('pump');
// const structjson = require('./util/structjson');
// const through2 = require('through2');

// function detectTextIntent(projectId, sessionId, queries, languageCode) {
//   const dialogFlow = require('dialogflow');
//   const sessionClient = new dialogflow.SessionsClient();
//   if (!queries || !queries.length) {
//     return;
//   }

//   const sessionPath = sessionClient.sessionPath(projectId, sessionId);
//   let promise;

//   // Detects the intent of the queries.
//   for (const query of queries) {
//     // The text query request.
//     const request = {
//       session: sessionPath,
//       queryInput: {
//         text: {
//           text: query,
//           languageCode,
//         },
//       },
//     };

//     if (!promise) {
//       // First query.
//       console.log(`Sending query "${query}"`);
//       promise = sessionClient.detectIntent(request);
//     } else {
//       promise = promise.then((responses) => {
//         console.log('Detected intent');
//         const response = responses[0];
//         logQueryResult(sessionClient, response.queryResult);

//         // Use output contexts as input contexts for the next query.
//         response.queryResult.outputContexts.forEach((context) => {
//           // There is a bug in gRPC that the returned google.protobuf.Struct
//           // value contains fields with value of null, which causes error
//           // when encoding it back. Converting to JSON and back to proto
//           // removes those values.
//           const sJson = structjson.structProtoToJson(context.parameters);
//           context.parameters = structjson.jsonToStructProto(sJson);
//         });
//         request.queryParams = {
//           contexts: response.queryResult.outputContexts,
//         };

//         console.log(`Sending query "${query}"`);
//         return sessionClient.detectIntent(request);
//       });
//     }
//   }
// }

// function logQueryResult(sessionClient, result) {
//   // Imports the Dialogflow library
//   const dialogflow = require('dialogflow');

//   // Instantiates a context client
//   const contextClient = new dialogflow.ContextsClient();

//   console.log(`  Query: ${result.queryText}`);
//   console.log(`  Response: ${result.fulfillmentText}`);
//   if (result.intent) {
//     console.log(`  Intent: ${result.intent.displayName}`);
//   } else {
//     console.log('  No intent matched.');
//   }
//   const sJson = structjson.structProtoToJson(result.parameters);
//   const parameters = JSON.stringify(sJson);
//   console.log(`  Parameters: ${parameters}`);
//   if (result.outputContexts && result.outputContexts.length) {
//     console.log('  Output contexts:');
//     result.outputContexts.forEach((context) => {
//       const contextId = contextClient.matchContextFromContextName(context.name);
//       const sJson2 = structjson.structProtoToJson(context.parameters);
//       const contextParameters = JSON.stringify(sJson2);
//       console.log(`    ${contextId}`);
//       console.log(`      lifespan: ${context.lifespanCount}`);
//       console.log(`      parameters: ${contextParameters}`);
//     });
//   }
// }
