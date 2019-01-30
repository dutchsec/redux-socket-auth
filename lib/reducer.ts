import { AnyAction } from 'redux';
import {
	LOGIN, LOGIN_FAILED,
	LOGIN_SUCCESS,
	LOGOUT, NO_TOKEN_FOUND,
	RESUME_SESSION_FAILED,
	RESUME_SESSION_SUCCESS, SIGN_UP, SIGN_UP_SUCCESS
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
		case LOGIN:
		case SIGN_UP: {
			return {
				...state,
				isAuthenticating: true
			};
		}

		case LOGIN_SUCCESS:
		case SIGN_UP_SUCCESS:
		case RESUME_SESSION_SUCCESS: {
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

		case RESUME_SESSION_FAILED:
		case NO_TOKEN_FOUND:
		case LOGIN_FAILED: {
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