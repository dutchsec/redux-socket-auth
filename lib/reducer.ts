import { AnyAction } from 'redux';
import {
	LOGIN, LOGIN_RESPONSE,
	LOGOUT, NO_TOKEN_FOUND, RESUME_SESSION_RESPONSE,
	SIGN_UP, SIGN_UP_RESPONSE
} from './constants';

export interface ReduxSocketAuthState {
	isAuthenticating: boolean;
	isAuthenticated: boolean;
	user: User | null;
}

export interface AppState {
	reduxSocketAuth: ReduxSocketAuthState;
	[key: string]: any;
}

export interface User {
	role: string;
	[key: string]: any;
}

export const defaultReduxSocketAuthState: ReduxSocketAuthState = {
	isAuthenticating: true,
	isAuthenticated: false,
	user: null
};

export function reduxSocketAuthReducer(
	state: ReduxSocketAuthState = defaultReduxSocketAuthState,
	action: AnyAction
): ReduxSocketAuthState {
	switch (action.type) {
		case LOGIN_RESPONSE:
		case SIGN_UP_RESPONSE:
		case RESUME_SESSION_RESPONSE: {
			if (action.error) {
				return {
					...state,
					isAuthenticating: false
				}
			}

			return {
				...state,
				isAuthenticated: true,
				isAuthenticating: false,
				user: action.payload.user,
			};
		}

		case LOGOUT: {
			return {
				...state,
				isAuthenticated: false
			};
		}

		case NO_TOKEN_FOUND: {
			return {
				...state,
				isAuthenticating: false,
			};
		}

		default: {
			return state;
		}
	}
}