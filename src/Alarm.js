import React, {Component} from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: props.time,
      status: props.status || "on"
    };

    this.handleStatusToggle = this.handleStatusToggle.bind(this);
  }

  handleStatusToggle() {
    // TODO: Set in S3 bucket

    const status = this.state.status === "on" ? "off" : "on";
    this.setState({
      status
    });
  }
  
  render () {
    const {time, status} = this.state;
    return (
      <div className="alarm">
        <span className="time">{time.format('h:mm a, dddd')}</span>
        <span className={`status ${status}`} onClick={this.handleStatusToggle}>{status}</span>
      </div>
    );
  }
}

export default Clock;