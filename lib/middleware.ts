import { Middleware, AnyAction } from 'redux';
import {
	LOGIN,
	LOGIN_FAILED,
	LOGIN_SUCCESS, LOGOUT,
	NO_TOKEN_FOUND,
	RESUME_SESSION,
	RESUME_SESSION_FAILED,
	RESUME_SESSION_SUCCESS, SIGN_UP_SUCCESS
} from './constants';
import {
	SOCKET_OPENED
} from 'redux-reconnecting-socket';
import { noTokenFound, resumeSession } from './actions';
import { push } from 'react-router-redux';

export interface ReduxSocketAuthConfig {
	redirects?: {
		loginSuccess?: string;
		signUpSuccess?: string;
		resumeSessionFailed?: string;
	}
}

export const defaultReduxSocketAuthConfig: ReduxSocketAuthConfig = {
	redirects: {
		loginSuccess: '/',
		signUpSuccess: '/',
		resumeSessionFailed: '/login'
	}
};

const localStorageTokenKey = 'jwtToken';

export function reduxSocketAuth(config: ReduxSocketAuthConfig = defaultReduxSocketAuthConfig): Middleware {
	config = {
		...defaultReduxSocketAuthConfig,
		...config
	};

	config.redirects = {
		...defaultReduxSocketAuthConfig.redirects,
		...config.redirects,
	};

	return ({ dispatch }) => {
		return next => action => {

			switch (action.type) {
				case SOCKET_OPENED: {
					const jwtToken = localStorage.getItem(localStorageTokenKey);

					if (jwtToken) {
						dispatch(resumeSession(jwtToken));
					} else {
						dispatch(noTokenFound());
						dispatch(push(config.redirects.resumeSessionFailed));
					}

					break;
				}

				case LOGIN_SUCCESS: {
					localStorage.setItem(localStorageTokenKey, action.payload.jwtToken);
					dispatch(push(config.redirects.loginSuccess));

					break;
				}

				case RESUME_SESSION_SUCCESS: {
					localStorage.setItem(localStorageTokenKey, action.payload.jwtToken);

					break;
				}

				case SIGN_UP_SUCCESS: {
					localStorage.setItem(localStorageTokenKey, action.payload.jwtToken);
					dispatch(push(config.redirects.signUpSuccess));

					break;
				}

				case LOGOUT: {
					localStorage.removeItem(localStorageTokenKey);
				}
			}

			return next(action);
		};
	};
}