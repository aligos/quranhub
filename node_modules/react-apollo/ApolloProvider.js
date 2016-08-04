"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_1 = require('react');
var react_redux_1 = require('react-redux');
var invariant = require('invariant');
var ApolloProvider = (function (_super) {
    __extends(ApolloProvider, _super);
    function ApolloProvider(props, context) {
        _super.call(this, props, context);
        invariant(props.client, 'ApolloClient was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
        this.client = props.client;
        if (props.store) {
            this.store = props.store;
            return;
        }
        props.client.initStore();
        this.store = props.client.store;
    }
    ApolloProvider.prototype.getChildContext = function () {
        return {
            store: this.store,
            client: this.client,
        };
    };
    ApolloProvider.prototype.render = function () {
        var children = this.props.children;
        return (React.createElement(react_redux_1.Provider, {store: this.store}, children));
    };
    ApolloProvider.propTypes = {
        store: react_1.PropTypes.shape({
            subscribe: react_1.PropTypes.func.isRequired,
            dispatch: react_1.PropTypes.func.isRequired,
            getState: react_1.PropTypes.func.isRequired,
        }),
        client: react_1.PropTypes.object.isRequired,
        children: react_1.PropTypes.element.isRequired,
    };
    ApolloProvider.childContextTypes = {
        store: react_1.PropTypes.object.isRequired,
        client: react_1.PropTypes.object.isRequired,
    };
    return ApolloProvider;
}(react_1.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApolloProvider;
;
//# sourceMappingURL=ApolloProvider.js.map