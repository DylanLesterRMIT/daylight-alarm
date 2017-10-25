import React, { Component } from 'react';
import shortid from 'shortid';
import { saveToS3, loadFromS3 } from './Utils';

// Components
import Alarm from './Alarm';
import AlarmInput from './AlarmInput';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
      alarms: []
    };

    this.handleAlarmStatusToggle = this.handleAlarmStatusToggle.bind(this);
    this.handleEmptyAlarms = this.handleEmptyAlarms.bind(this);
    this.handleAddAlarm = this.handleAddAlarm.bind(this);
  }

  // Lifecycle methods
  componentDidMount() {
    // Run clock
    this.timer = setInterval(() => this.clockTick(), 1000);

    // Load alarms from S3
    loadFromS3().then(alarms => this.setState({alarms}));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  clockTick() {
    this.setState({currentTime: new Date()});
  }

  // Alarm handlers
  handleAlarmStatusToggle(alarm) {
    // Toggle alarms status
    alarm.status = alarm.status === "on" ? "off" : "on";
    
    this.setState({alarms: this.state.alarms}, () => {
      // Set in S3 bucket
      saveToS3(this.state.alarms);
    });
  }

  handleEmptyAlarms() {
    this.setState({alarms: []}, () => {
      // Set in S3 bucket
      saveToS3(this.state.alarms);
    });
  }

  handleAddAlarm(date) {
    const alarms = [...this.state.alarms];

    // Add to alarms
    alarms.push({
      id: shortid.generate(),
      time: date,
      status: 'on'
    });

    this.setState({alarms}, () => {
      // Set in S3 bucket
      saveToS3(this.state.alarms);
    });
  }

  render () {
    const { currentTime, alarms } = this.state;

    let alarmsSection;
    if (alarms.length > 0) {
      alarmsSection = alarms.map(alarm => 
        <Alarm key={alarm.id}
               alarm={alarm}
               handleStatusToggle={this.handleAlarmStatusToggle} />
      );
    }
    else {
      alarmsSection = <div className="no-alarms">No alarms set, try and add some!</div>
    }
    
    return (
      <div className="container">
        <h2 className="clock">{currentTime.toLocaleTimeString()}</h2>
        <div className="alarms-container">
          {/* Show all alarms */}
          {alarmsSection}

          {/* Creating new alarms */}
          <AlarmInput onAddAlarm={this.handleAddAlarm} />
        </div>

        {/* Show empty alarms if alarms exist */}
        {alarms.length > 0 &&
          <div className="clear-button-container">
            <button className="clear-button" onClick={this.handleEmptyAlarms}>Empty alarms</button>
          </div>
        }
      </div>
    );
  }
}

export default Clock;