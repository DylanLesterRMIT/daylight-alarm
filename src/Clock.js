import React, { Component } from 'react';
import Moment from 'moment';
import shortid from 'shortid';
import { saveToS3, loadFromS3 } from './Utils';

// Components
import Alarm from './Alarm';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
      alarmInput: '',
      alarms: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAlarmStatusToggle = this.handleAlarmStatusToggle.bind(this);
    this.handleEmptyAlarms = this.handleEmptyAlarms.bind(this);
  }

  // Lifecycle methods
  componentDidMount() {
    // Run clock
    this.timer = setInterval(() => this.clockTick(), 1000);

    // Load alarms from S3
    loadFromS3().then(fetchedAlarms => {
      // Transform time string into Moment object
      const alarms = fetchedAlarms.map(a => {
        a.time = new Moment(a.time);
        return a;
      });

      this.setState({alarms})
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  clockTick() {
    this.setState({currentTime: new Date()});
  }

  // Form handlers
  handleChange(event) {
    this.setState({
      alarmInput: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const date = Moment(this.state.alarmInput, ['h:m a', 'H:m']);
    if (!date.isValid()) {
      alert('Whoops, please enter a time value');
      return;
    }

    // Add to alarms
    this.state.alarms.push({
      id: shortid.generate(),
      time: date,
      status: 'on'
    });

    this.setState({
      alarmInput: '',
      alarms: this.state.alarms
    });

    // Set in S3 bucket
    saveToS3(this.state.alarms);    
  }

  // Alarm handlers
  handleAlarmStatusToggle(toggledAlarm) {
    // Toggle alarms status
    const alarms = [...this.state.alarms];
    const alarm = alarms.find(a => a.id === toggledAlarm.id);
    alarm.status = alarm.status === "on" ? "off" : "on";
    this.setState({alarms}); // Should re-render, doesn't

    // Set in S3 bucket
    saveToS3(this.state.alarms);
  }

  handleEmptyAlarms() {
    this.setState({alarms: []}, () => {
      // Set in S3 bucket
      saveToS3(this.state.alarms);
    });
  }

  render () {
    const { currentTime, alarms, alarmInput } = this.state;

    let alarmsSection;
    if (alarms.length > 0) {
      alarmsSection = alarms.map(({ id, time, status }) => 
        <Alarm key={id}
               id={id}
               time={time}
               status={status}
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
          {alarmsSection}

          {/* Creating new alarms */}
          <form onSubmit={this.handleSubmit} className="alarm create">
            <input type="text" value={alarmInput} onChange={this.handleChange} placeholder="Add alarm (new time)" />
            <input type="submit" className="status" />
          </form>
        </div>
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