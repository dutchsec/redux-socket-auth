import { AnyAction } from 'redux';
import {
	LOGIN,
	LOGOUT,
	NO_TOKEN_FOUND,
	RESUME_SESSION,
	SIGN_UP, UPDATE_USER
} from './constants';
import { User } from './reducer';

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

export function resumeSession(jwtToken: string) {
	return {
		type: RESUME_SESSION,
		sendToServer: true,
		promise: true,
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

export function updateUser(user: User) {
	return {
		type: UPDATE_USER,
		sendToServer: true,
		promise: true,
		payload: {
			user
		}
	};
}