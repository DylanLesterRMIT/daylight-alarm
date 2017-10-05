import React, {Component} from 'react';
import Moment from 'moment';
import Alarm from './Alarm';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
      alarmInput: '',
      alarms: [
        {
          time: Moment('8:00 10/10/17'),
          status: 'on'
        },
        {
          time: Moment('22:00 12/10/17'),
          status: 'off'
        }
      ]
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
      time: date,
      status: 'on'
    });

    this.setState({
      alarmInput: '',
      alarms: this.state.alarms
    });

    // TODO: Set in S3 bucket
  }

  tick() {
    this.setState({currentTime: new Date()});
  }

  render () {
    return (
      <div className="container">
        <h2 className="clock">{this.state.currentTime.toLocaleTimeString()}</h2>
        <div className="alarms-container">
          {this.state.alarms.map((alarm, i) => 
            <Alarm time={alarm.time} status={alarm.status} key={i} />
          )}

          {/* Creating new alarms */}
          <form onSubmit={this.handleSubmit} className="alarm create">
            <input type="text" value={this.state.alarmInput} onChange={this.handleChange} placeholder="Add alarm (new time)" />
            <input type="submit" className="status" />
          </form>
        </div>
      </div>
    );
  }
}

export default Clock;