import { AnyAction } from 'redux';
import { LOGIN, NO_TOKEN_FOUND, RESUME_SESSION } from './constants';

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

