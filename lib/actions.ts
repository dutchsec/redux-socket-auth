import { AnyAction } from 'redux';
import { LOGIN, NO_TOKEN_FOUND, RESUME_SESSION, SIGN_UP } from './constants';

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

export function resumeSession(jwtToken: string) {
	return {
		type: RESUME_SESSION,
		sendToServer: true,
		promise: true,
		payload: {
			jwtToken
		}
	}
}

export function noTokenFound() {
	return {
		type: NO_TOKEN_FOUND
	};
}

