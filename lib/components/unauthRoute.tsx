import * as React from 'react';
import { Route, RouteProps, Redirect, Router } from 'react-router-dom';
import { AppState, ReduxSocketAuthState, User } from '../reducer';
import { connect } from 'react-redux';

export interface UnauthRouteProps extends RouteProps {
	roles?: string[];
	redirectTo: string;
}

interface ConnectedUnauthRouteProps extends UnauthRouteProps {
	isAuthenticated: boolean;
	isAuthenticating: boolean;
}

class UnauthRoute extends React.Component<ConnectedUnauthRouteProps> {
	render() {
		const { isAuthenticated, isAuthenticating, redirectTo } = this.props;

		if (isAuthenticating) {
			return null;
		}

		if (isAuthenticated) {
			return <Redirect to={redirectTo} />;
		}

		return (
			<Route
				{...this.props}
			/>
		);
	}
}

const select = (state: AppState, ownProps: UnauthRouteProps): ConnectedUnauthRouteProps => ({
	...ownProps,
	isAuthenticated: state.reduxSocketAuth.isAuthenticated,
	isAuthenticating: state.reduxSocketAuth.isAuthenticating
});

export default connect(select)(UnauthRoute);