# Daylight Alarm

Daylight Alarm is a product that allows a user to create alarms that when triggered open the user’s blinds/ curtains. Opening the user’s blinds will allow the daylight to seep in and wake the user in a natural way. This is the trivial, fun and potentially useful purpose of the Daylight Alarm project.

## Getting Started

Daylight Alarm utilises the AWS cloud stack, therefore there is little required to start.
Open up `dist/index.html` to see the application. To make changes to the application code it requires having [Node.js and NPM](https://nodejs.org/en/) installed and then running `npm start` from the root directory.

## AWS Stack
Daylight Alarm makes use of the AWS cloud stack. The technologies used are listed here:

- Amazon S3
- AWS Lambda
- Amazon CloudWatch

## Additional Technologies
React has been used to build the front-end. Ideally, Express will be used to create the server that receives the alarms

### TODOs

- Check if the time zones influence the way the alarm works. The times are stored in UTC and we live in AEDT (that changes too when daylight savings leaves)
- Update the way I create CloudWatch Rules so that it deletes and disables appropriately (listed as a FIXME within create-alarms.js)
- Could utilise the async, await JavaScript keywords with the create-alarms script
- Refactor the Utils S3 SDK interactions to use promises
- React stuff
  + Figure out why changing the alarms within the Clock's alarms array and setting with setState doesn't cause a re-render
  + Implement a mechanism to delete alarm entries
  + Implement a mechanism to re-schedule alarm entries