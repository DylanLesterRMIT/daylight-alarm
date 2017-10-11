import React, { Component } from 'react';
import Moment from 'moment';
import shortid from 'shortid';
import { saveToS3 } from './Utils';

// Components
import Alarm from './Alarm';

const demoAlarms = [
  {
    id: shortid.generate(),
    time: Moment('8:30 am', ['h:m a', 'H:m']),
    status: 'on'
  },
  {
    id: shortid.generate(),
    time: Moment('10:00 pm', ['h:m a', 'H:m']),
    status: 'off'
  }
]

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
      alarmInput: '',
      alarms: demoAlarms
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

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

    // TODO: Set in S3 bucket
    saveToS3('TODO');
  }

  tick() {
    this.setState({currentTime: new Date()});
  }

  render () {
    const { currentTime, alarms, alarmInput } = this.state;
    return (
      <div className="container">
        <h2 className="clock">{currentTime.toLocaleTimeString()}</h2>
        <div className="alarms-container">
          {alarms.map(({ id, time, status }, i) => 
            <Alarm key={id}
                   id={id}
                   time={time}
                   status={status}
                   handleStatusToggle={this.handleAlarmStatusToggle} />
          )}

          {/* Creating new alarms */}
          <form onSubmit={this.handleSubmit} className="alarm create">
            <input type="text" value={alarmInput} onChange={this.handleChange} placeholder="Add alarm (new time)" />
            <input type="submit" className="status" />
          </form>
        </div>
      </div>
    );
  }
}

export default Clock;