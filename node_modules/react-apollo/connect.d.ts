import { IMapStateToProps, IMapDispatchToProps, IConnectOptions } from 'react-redux';
export interface MapQueriesToPropsOptions {
    ownProps: any;
    state: any;
}
export interface MapMutationsToPropsOptions {
    ownProps: any;
    state: any;
}
export interface ConnectOptions {
    mapStateToProps?: IMapStateToProps;
    mapDispatchToProps?: IMapDispatchToProps;
    options?: IConnectOptions;
    mergeProps?(stateProps: Object, dispatchProps: Object, ownProps: Object): Object;
    mapQueriesToProps?(opts: MapQueriesToPropsOptions): Object;
    mapMutationsToProps?(opts: MapMutationsToPropsOptions): Object;
}
export default function connect(opts?: ConnectOptions): (WrappedComponent: any) => any;
