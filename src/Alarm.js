import React, {Component} from 'react';

class Clock extends Component {
  render () {
    return (
      <div className="alarm">
        <span className="time">{this.props.time}</span>
        <span className={`status ${this.props.status}`}>{this.props.status}</span>
      </div>
    );
  }
}

export default Clock;