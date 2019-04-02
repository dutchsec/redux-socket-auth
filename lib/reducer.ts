import { AnyAction } from 'redux';
import {
	GET_USER_RESPONSE,
	LOGIN, LOGIN_RESPONSE,
	LOGOUT, NO_TOKEN_FOUND, RESUME_SESSION_RESPONSE, SET_CONFIRM_EMAIL_TOKEN,
	SIGN_UP, SIGN_UP_RESPONSE, UPDATE_USER_RESPONSE
} from './constants';

export interface ReduxSocketAuthState {
	isAuthenticating: boolean;
	isAuthenticated: boolean;
	user: User | null;
	confirmEmailToken: string;
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
	user: null,
	confirmEmailToken: null
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

		case UPDATE_USER_RESPONSE: {
			if (action.payload && action.payload.user) {
				return {
					...state,
					user: action.payload.user
				};
			}

			return state;
		}

		case SET_CONFIRM_EMAIL_TOKEN: {
			return {
				...state,
				confirmEmailToken: action.payload.token
			};
		}

		case GET_USER_RESPONSE: {
			if (action.payload && action.payload.user) {
				return {
					...state,
					user: action.payload.user
				};
			}

			return state;
		}

		default: {
			return state;
		}
	}
}