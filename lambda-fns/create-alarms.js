const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    
    s3.getObject(params).promise()
        .then(dataFile => {
            const alarms = JSON.parse(dataFile.Body.toString());
    
            // Create CloudWatch events from alarms array
            createCloudWatchRulesFromAlarms(alarms);
        })
        .catch(err => {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
        });
};

function createCloudWatchRulesFromAlarms(alarms) {
    const cloudwatchevents = new aws.CloudWatchEvents();

    // Iterate over alarms and create associated rules
    alarms.forEach(alarm => {
        // Extract alarm time
        const date = new Date(alarm.time);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Prepare parameters
        const scheduleExpression = `cron(${minutes} ${hours} * * ? *)`; // Set alarm to run everyday
        const params = {
            Name: alarm.id,
            ScheduleExpression: scheduleExpression
        };
    
        // Create alarms
        cloudwatchevents.putRule(params).promise()
            .then(success => console.log(`Created rule for ${alarm.id} successfully!`))
            .catch(err => console.log(err, err.stack));
    });
}

// FIXME

// The below is mainly pseudo code that states what should happen in createCloudWatchRulesFromAlarms.
// Currently, it is unconcerned with the below.
/*
1. List all rules via cloudwatchevents.listRules(...)
cloudwatchevents.listRules({}).promise()
.then(rules => console.log('Rules:', rules))
.catch(err => console.log(err, err.stack));

2. Remove all rules that are not in the passed alarms using cloudwatchevents.deleteRule(...)
  this may involve the use of cloudwatchevents.removeTargets(...)

3. Add rules that have a status of "on" (using cloudwatchevents.putRule(...)) and disable 
  rules that have status set to "off" (using cloudwatchevents.disableRule(...)).
  This also means using cloudwatchevents.enableRule(...) to turn them back on


--- may need to use cloudwatchevents.putTargets(...) to attach the Lambda function to them
*/