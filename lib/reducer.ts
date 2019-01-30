import { AnyAction } from 'redux';
import {
	LOGIN,
	LOGIN_SUCCESS,
	LOGOUT, NO_TOKEN_FOUND,
	RESUME_SESSION_FAILED,
	RESUME_SESSION_SUCCESS
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
		case LOGIN: {
			return {
				...state,
				isAuthenticating: true
			};
		}

		case LOGIN_SUCCESS:
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