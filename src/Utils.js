export function saveToS3(data) {
  // Send data to S3 Bucket
  const params = {
    Bucket: 's3542871-cc-assignment-2-alarms'
  };

  const s3 = new AWS.S3({params});

  const uploadData = {
    Key: 'alarms.json',
    ContentType: 'application/json',
    Body: JSON.stringify(data, null, 4)
  };

  // Perform upload
  s3.upload(uploadData)
    .send((err, data) => {
      if (err) throw err;
      // Perfom with knowledge of returned data
    });
}

export function loadFromS3() {
  // Load data from S3 Bucket
  const s3 = new AWS.S3();
  
  const loadData = {
    Bucket: 's3542871-cc-assignment-2-alarms',
    Key: 'alarms.json'
  };

  return new Promise((resolve, reject) => 
    s3.getObject(loadData, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      }
      resolve(JSON.parse(data.Body.toString()));
    })
  );
}

// FIXME: Code from Clock.handleAlarmStatusToggle() that doesn't work

// The below does not work. It updates the state's alarms array but for some reason does
// not trigger a re-render
/*
console.log('Alarms:', this.state.alarms);

// Toggle alarm's status
const alarms = [...this.state.alarms];
const alarm = alarms.find(alarm => alarm.id === toggledAlarm.id);
alarm.status = alarm.status === "on" ? "off" : "on";
this.setState({alarms});

console.log('Updated alarms:', this.state.alarms);
*/