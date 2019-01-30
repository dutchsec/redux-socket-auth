import * as React from 'react';
import { Route, RouteProps, Redirect, Router } from 'react-router-dom';
import { AppState, ReduxSocketAuthState, User } from '../../reducer';
import { connect } from 'react-redux';

export interface AuthRouteProps extends RouteProps {
	roles?: string[];
	redirectTo: string;
}

interface ConnectedAuthRouteProps extends AuthRouteProps {
	isAuthenticated: boolean;
	isAuthenticating: boolean;
	user: User;
}


const select = (state: AppState, ownProps: AuthRouteProps): ConnectedAuthRouteProps => ({
	...ownProps,
	isAuthenticated: state.reduxSocketAuth.isAuthenticated,
	isAuthenticating: state.reduxSocketAuth.isAuthenticating,
	user: state.reduxSocketAuth.user
});

class AuthRoute extends React.Component<ConnectedAuthRouteProps> {
	render() {
		const { isAuthenticated, isAuthenticating, redirectTo } = this.props;

		if (isAuthenticating) {
			return null;
		}

		if (!isAuthenticated) {
			return <Redirect to={redirectTo} />;
		}

		return (
			<Route
				{...this.props}
			/>
		);
	}
}

export default connect(select)(AuthRoute);