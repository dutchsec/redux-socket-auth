import * as React from 'react';
import { Route, RouteProps, Redirect, Router } from 'react-router-dom';
import { AppState, ReduxSocketAuthState, User } from '../reducer';
import { connect } from 'react-redux';

export interface AuthRouteProps extends RouteProps {
	redirectTo: string;
	roles?: string[];
	rolesRedirectTo?: string;
}

interface ConnectedAuthRouteProps extends AuthRouteProps {
	isAuthenticated: boolean;
	isAuthenticating: boolean;
	user: User;
}

class AuthRoute extends React.Component<ConnectedAuthRouteProps> {
	render() {
		const { isAuthenticated, isAuthenticating, redirectTo, roles, rolesRedirectTo, user } = this.props;

		if (isAuthenticating) {
			return null;
		}

		if (!isAuthenticated) {
			return <Redirect to={redirectTo} />;
		}

		if (roles && roles.indexOf(user.role) === -1) {
			return <Redirect to={rolesRedirectTo ? rolesRedirectTo : redirectTo}/>;
		}

		return (
			<Route
				{...this.props}
			/>
		);
	}
}

const select = (state: AppState, ownProps: AuthRouteProps): ConnectedAuthRouteProps => ({
	...ownProps,
	isAuthenticated: state.reduxSocketAuth.isAuthenticated,
	isAuthenticating: state.reduxSocketAuth.isAuthenticating,
	user: state.reduxSocketAuth.user
});

export default connect(select)(AuthRoute);