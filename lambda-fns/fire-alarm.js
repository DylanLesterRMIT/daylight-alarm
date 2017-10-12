const aws = require('aws-sdk');

const params = {
  Bucket: 's3542871-cc-assignment-2-alarms'
};

const s3 = new aws.S3({params});

exports.handler = (event, context, callback) => {
  const uploadData = {
    Key: 'received.txt',
    ContentType: 'text/plain',
    Body: `Alarm has been fired at ${new Date()}`
  };

  // Upload dummy text to demonstrate alarm
  s3.upload(uploadData).send((err, data) => {
    if (err) throw err;
  });
};