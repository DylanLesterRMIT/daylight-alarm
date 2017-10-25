import React, { Component } from 'react';
import Moment from 'moment';

class AlarmInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleSubmit(ev) {
    ev.preventDefault();

    const date = Moment(this.state.value, ['h:m a', 'H:m']);
    if (!date.isValid()) {
      alert('Whoops, please enter a time value');
      return;
    }

    this.setState({value: ''});
    this.props.onAddAlarm(date);
  }

  handleChange(ev) {
    this.setState({value: ev.target.value});
  }
  
  render () {
    const value = this.state.value;
    return (
      <form onSubmit={this.handleSubmit} className="alarm create">
        <input type="text" value={value} onChange={this.handleChange} placeholder="Add alarm (new time)" />
        <input type="submit" className="status" />
      </form>
    );
  }
}

export default AlarmInput;
