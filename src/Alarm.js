import React, { Component } from 'react';
import { saveToS3 } from './Utils';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      time: props.time,
      status: props.status || "on",
      parentHandleStatusToggle: props.handleStatusToggle      
    };

    this.handleStatusToggle = this.handleStatusToggle.bind(this);
  }

  handleStatusToggle() {
    this.state.parentHandleStatusToggle(this.state);
    
    // Toggle alarm's status
    const status = this.state.status === "on" ? "off" : "on";
    this.setState({
      status
    });
  }
  
  render () {
    const { time, status } = this.state;
    return (
      <div className="alarm">
        <span className="time">{time.format('h:mm a')}</span>
        <span className={`status ${status}`} onClick={this.handleStatusToggle}>{status}</span>
      </div>
    );
  }
}

export default Clock;