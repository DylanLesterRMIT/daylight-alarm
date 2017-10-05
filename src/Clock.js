import React, {Component} from 'react';
import Alarm from './Alarm';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date()
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({currentTime: new Date()});
  }

  render () {
    return (
      <div className="container">
        <h2 className="clock">{this.state.currentTime.toLocaleTimeString()}</h2>
        <div className="alarms-container">
          <Alarm time="8:00 am" status="on" />
          <Alarm time="10:00 pm" status="off" />
          <form action="" className="alarm create">
            <input type="text" placeholder="Create new alarm" />
            <input type="submit" className="status" />
          </form>
        </div>
      </div>
    );
  }
}

export default Clock;