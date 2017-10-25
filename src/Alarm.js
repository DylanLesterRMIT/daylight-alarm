import React, { Component } from 'react';

class Alarm extends Component {
  handleStatusToggle(alarm) {
    this.props.handleStatusToggle(alarm);
  }
  
  render () {
    const alarm = this.props.alarm;
    const time = alarm.time;
    return (
      <div className="alarm">
        <span className="time">{time.format('h:mm a')}</span>
        <AlarmToggle alarm={alarm} onClick={this.handleStatusToggle.bind(this)} />
      </div>
    );
  }
}

class AlarmToggle extends Component {
  handleClick(ev) {
    this.props.onClick(this.props.alarm);
  }

  render() {
    const status = this.props.alarm.status;
    return <span className={`status ${status}`} onClick={this.handleClick.bind(this)}>{status}</span>;
  }
}

export default Alarm;