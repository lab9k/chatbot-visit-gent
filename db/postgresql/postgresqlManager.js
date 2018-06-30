//connection with postgresql
const pg = require('knex')({
    client: 'pg',
    connection: process.env.CONNECTION_STRING,
    searchPath: ['knex', 'public']
});

const checkConnectionAndTable = () => {
    if (process.env.CONNECTION_STRING) {
      pg.schema.hasTable('feedback').then((exists) => {
        //console.log('feedbackTableExists', exists);
        if (!exists) {
          console.log('creating table...');
          pg.schema
            .createTable('feedback', (table) => {
              table.increments();
              table.text('body', 'longtext');
              table.string('created_at');
            })
            .then(() => {
              console.log('feedback table succesfully created!');
            });
        } else {
          console.log('table feedback already exists');
        }
      });
  
    } else {
      console.log('no connection with pg');
    }
  };

  const addFeedbackImprovement = (improvementProposal) => {
    console.log('feedback improvement triggered');
    const getTimezoneDate = () => {
      const date = new Date();
      const hours = date.getHours() + 2;
      const minutes = date.getMinutes();
      const miliseconds = date.getMilliseconds();
      const fullDateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${hours}:${minutes}:${miliseconds}`;
      console.log(fullDateString);
      return fullDateString;
    };
  
    pg
      .insert({
        body: improvementProposal,
        created_at: getTimezoneDate()
      })
      .into('feedback')
      .then(() => {
        console.log('feedback data insterted!');
        pg
          .select()
          .table('feedback')
          .then((results) => {
            console.log(results);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  module.exports = {
    checkConnectionAndTable,
    addFeedbackImprovement
  }