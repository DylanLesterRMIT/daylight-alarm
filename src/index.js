import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return <h2>Hello World!</h2>;
  }
}

render(<App/>, document.getElementById('app'));