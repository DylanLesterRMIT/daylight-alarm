export function saveToS3(data) {
  // Send data to S3 Bucket
  console.log('Data:', data);
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