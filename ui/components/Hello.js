import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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
        <h1>Hello!</h1>
        <button onClick={onIncrementCount}>Click me</button>
        <p>You've pressed the button {count} times.</p>
        <Link to="/">Home</Link>

        <Info />
      </div>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Hello);
