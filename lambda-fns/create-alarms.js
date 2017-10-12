const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const cloudwatchevents = new aws.CloudWatchEvents();

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
    // Iterate over alarms and create associated rules
    alarms.forEach(alarm => {
        // Extract alarm time
        const date = new Date(alarm.time);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Set rule name to something meaningful
        alarm.name = `${hours}-${minutes}-${alarm.id}`

        // Prepare parameters
        const scheduleExpression = `cron(${minutes} ${hours} * * ? *)`; // Set alarm to run everyday
        const params = {
            Name: alarm.name,
            ScheduleExpression: scheduleExpression
        };
    
        // Create alarms
        cloudwatchevents.putRule(params).promise()
            .then(success => {
                console.log(`Created rule for ${alarm.name} successfully!`);
                console.log('Returned success item:', success);

                attachTargetToAlarm(alarm);
            })
            .catch(err => console.log(err, err.stack));
    });
}

function attachTargetToAlarm(alarm) {
    const params = {
        Rule: alarm.name,
        // Pretty fiddly getting the blow to work, required debugging the AWS services as no error was thrown
        Targets: [ /* required */
            {
                Arn: 'arn:aws:lambda:ap-southeast-2:760928209219:function:fire-alarm', /* required */
                Id: 'Id288879814480', /* required */
                Input: JSON.stringify({response: 'This is the input for the alarm that was created by create-alarms!'}),
            }
        ]
    };
    cloudwatchevents.putTargets(params).promise()
        .then(success => {
            console.log(`Put target on ${alarm.name} successfully!`);
            console.log('Returned success item:', success);
        })
        .catch(err => console.log(err, err.stack));
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