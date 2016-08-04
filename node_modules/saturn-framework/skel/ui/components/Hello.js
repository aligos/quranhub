import React, { Component } from 'react';
import { connect } from 'react-redux';

import Info from './Info';
import { incrementCount } from '../actions/incrementCount';

const mapStateToProps = ({ count }) => ({ count });

const mapDispatchToProps = (dispatch) => ({
  onIncrementCount: () => {
    dispatch(incrementCount())
  }
});

class Hello extends Component {
  render() {
    const { count, onIncrementCount } = this.props;

    return (
      <div>
        <h1>Welcome to Apollo!</h1>
        <button onClick={onIncrementCount}>Click me</button>
        <p>You've pressed the button {count} times.</p>

        <Info />
      </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Hello);
