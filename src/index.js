import React from 'react';
import {render} from 'react-dom';
import AWS from 'aws-sdk';

import Clock from './Clock';

AWS.config.update({
  accessKeyId: 'AKIAIZJM2QUEPXT6JAHQ',
  secretAccessKey: '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',
  region: 'ap-southeast-2'
});

class App extends React.Component {
  render () {
    return <Clock />;
  }
}

render(<App/>, document.getElementById('app'));