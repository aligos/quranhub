import React, { Component } from 'react';
import Helmet from 'react-helmet';

class App extends Component {
  render() {

    return (
      <div>
        <Helmet title="Quran Hub Clone" />
        {this.props.children}
      </div>
    );
  }
};

export default App;
