"use strict";
var react_1 = require('react');
var ReactDOM = require('react-dom/server');
var apollo_client_1 = require('apollo-client');
var flatten = require('lodash.flatten');
var assign = require('object-assign');
function getPropsFromChild(child) {
    var props = child.props, type = child.type;
    var ownProps = assign({}, props);
    if (type && type.defaultProps)
        ownProps = assign(type.defaultProps, props);
    return ownProps;
}
exports.getPropsFromChild = getPropsFromChild;
function getChildFromComponent(component) {
    if (component && component.render)
        return component.render();
    return component;
}
exports.getChildFromComponent = getChildFromComponent;
function processQueries(queries, client) {
    queries = flatten(queries)
        .map(function (queryDetails) {
        var query = queryDetails.query, component = queryDetails.component, ownProps = queryDetails.ownProps, key = queryDetails.key, context = queryDetails.context;
        return client.query(query)
            .then(function (result) {
            var _a = result, data = _a.data, errors = _a.errors;
            ownProps[key] = assign({ loading: false, errors: errors }, data);
            return { component: component, ownProps: assign({}, ownProps), context: assign({}, context) };
        });
    });
    return Promise.all(queries);
}
exports.processQueries = processQueries;
var defaultReactProps = { loading: true, errors: null };
function getQueriesFromTree(_a) {
    var component = _a.component, _b = _a.context, context = _b === void 0 ? {} : _b, _c = _a.queries, queries = _c === void 0 ? [] : _c;
    if (!component)
        return;
    var client = context.client, store = context.store;
    if (typeof component === 'function')
        component = { type: component };
    var type = component.type, props = component.props;
    if (typeof type === 'function') {
        var ComponentClass = type;
        var ownProps = getPropsFromChild(component);
        if (typeof type.mapQueriesToProps === 'function') {
            var state = store.getState();
            var _d = type.opts, mapStateToProps = _d.mapStateToProps, mapDispatchToProps = _d.mapDispatchToProps, mergeProps = _d.mergeProps;
            var mappedState = mapStateToProps && mapStateToProps(state, ownProps);
            var mappedDisptach = mapDispatchToProps && mapDispatchToProps(store.dispatch, ownProps);
            var mergedProps = mergeProps && mergeProps(mappedState, mappedDisptach, ownProps);
            ownProps = assign(ownProps, mappedState, mappedDisptach, mergedProps);
            var data = type.mapQueriesToProps({ ownProps: ownProps, state: state });
            for (var key in data) {
                if (!data.hasOwnProperty(key))
                    continue;
                ownProps[key] = assign({}, defaultReactProps);
                if (data[key].ssr === false)
                    continue;
                queries.push({
                    query: data[key],
                    component: type.WrappedComponent,
                    key: key,
                    ownProps: ownProps,
                    context: context,
                });
            }
            ComponentClass = type.WrappedComponent;
        }
        var Component = new ComponentClass(ownProps, context);
        var newContext = context;
        if (Component.getChildContext)
            newContext = assign({}, context, Component.getChildContext());
        if (!store && ownProps.store)
            store = ownProps.store;
        if (!store && newContext.store)
            store = newContext.store;
        if (!client && ownProps.client && ownProps.client instanceof apollo_client_1.default) {
            client = ownProps.client;
        }
        if (!client && newContext.client && newContext.client instanceof apollo_client_1.default) {
            client = newContext.client;
        }
        getQueriesFromTree({
            component: getChildFromComponent(Component),
            context: newContext,
            queries: queries,
        });
    }
    else if (props && props.children) {
        react_1.Children.forEach(props.children, function (child) { return getQueriesFromTree({
            component: child,
            context: context,
            queries: queries,
        }); });
    }
    return { queries: queries, client: client, store: store };
}
function getDataFromTree(app, ctx) {
    if (ctx === void 0) { ctx = {}; }
    var _a = getQueriesFromTree({ component: app, context: ctx }), client = _a.client, store = _a.store, queries = _a.queries;
    if (!store && client && !client.store)
        client.initStore();
    if (!store && client && client.store)
        store = client.store;
    if (!client || !store)
        return Promise.resolve(null);
    if (!queries.length)
        return Promise.resolve({ store: store, client: client, initialState: store.getState() });
    return processQueries(queries, client)
        .then(function (trees) { return Promise.all(trees.map(function (x) {
        var component = x.component, ownProps = x.ownProps, context = x.context;
        if (!component)
            return;
        var Element = react_1.createElement(component, ownProps);
        var child = getChildFromComponent(Element && new Element.type(ownProps, context));
        if (!child)
            return;
        return getDataFromTree(child, context);
    })); })
        .then(function () { return ({ store: store, client: client, initialState: store.getState() }); });
}
exports.getDataFromTree = getDataFromTree;
function renderToStringWithData(component) {
    return getDataFromTree(component)
        .then(function (_a) {
        var store = _a.store, client = _a.client;
        var markup = ReactDOM.renderToString(component);
        var initialState = store.getState();
        var key = client.reduxRootKey;
        for (var queryId in initialState[key].queries) {
            var fieldsToNotShip = ['minimizedQuery', 'minimizedQueryString'];
            for (var _i = 0, fieldsToNotShip_1 = fieldsToNotShip; _i < fieldsToNotShip_1.length; _i++) {
                var field = fieldsToNotShip_1[_i];
                delete initialState[key].queries[queryId][field];
            }
        }
        initialState = encodeURI(JSON.stringify(initialState));
        var payload = "<script>window.__APOLLO_STATE__ = " + initialState + ";</script>";
        markup += payload;
        return markup;
    });
}
exports.renderToStringWithData = renderToStringWithData;
//# sourceMappingURL=server.js.map