import { AnyAction } from 'redux';
import {
	CONFIRM_EMAIL, GET_USER,
	LOGIN,
	LOGOUT,
	NO_TOKEN_FOUND,
	RESUME_SESSION, SET_CONFIRM_EMAIL_TOKEN,
	SIGN_UP, TOKEN_RECEIVED, UPDATE_USER, VERIFY_EMAIL
} from './constants';

export function signUp(payload: any): AnyAction {
	return {
		type: SIGN_UP,
		sendToServer: true,
		promise: true,
		payload
	};
}

export function login(payload: any): AnyAction {
	return {
		type: LOGIN,
		sendToServer: true,
		promise: true,
		payload
	};
}

export function logout(): AnyAction {
	return {
		type: LOGOUT
	};
}

export function resumeSession(jwtToken: string, server?: string) {
	return {
		type: RESUME_SESSION,
		sendToServer: true,
		promise: true,
		server,
		payload: {
			jwtToken
		}
	};
}

export function noTokenFound() {
	return {
		type: NO_TOKEN_FOUND
	};
}

export function updateUser(user: any) {
	return {
		type: UPDATE_USER,
		sendToServer: true,
		promise: true,
		payload: {
			user
		}
	};
}

export function setConfirmEmailToken(token: string) {
	return {
		type: SET_CONFIRM_EMAIL_TOKEN,
		payload: {
			token
		}
	};
}

export function confirmEmail(token: string) {
	return {
		type: CONFIRM_EMAIL,
		sendToServer: true,
		promise: true,
		payload: {
			token
		}
	};
}

/**
 * Sends a new email with a new token
 */
export function verifyEmail() {
	return {
		type: VERIFY_EMAIL,
		sendToServer: true,
		promise: true,
		payload: {}
	};
}

export function getUser() {
	return {
		type: GET_USER,
		sendToServer: true,
		promise: true,
		payload: {}
	}
}

export function tokenReceived(token: string) {
	return {
		type: TOKEN_RECEIVED,
		payload: {
			token
		}
	};
}