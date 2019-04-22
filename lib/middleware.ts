import { Middleware, AnyAction } from 'redux';
import {
	CONFIRM_EMAIL, GET_USER,
	LOGIN,
	LOGIN_RESPONSE,
	LOGOUT, RESUME_SESSION,
	RESUME_SESSION_RESPONSE, SIGN_UP,
	SIGN_UP_RESPONSE, UPDATE_USER, VERIFY_EMAIL
} from './constants';
import {
	SOCKET_OPENED
} from 'redux-reconnecting-socket';
import {
	confirmEmail,
	noTokenFound,
	resumeSession,
	setConfirmEmailToken, tokenReceived
} from './actions';
import { AppState } from './reducer';

const localStorageTokenKey = 'jwtToken';

export interface ReduxSocketAuthConfig {
	serverName: string;
}

const defaultConfig: ReduxSocketAuthConfig = {
	serverName: 'default'
};

export function reduxSocketAuth(config: ReduxSocketAuthConfig = defaultConfig): Middleware {
	return ({ dispatch, getState }) => {
		return next => action => {
			switch (action.type) {
				case SIGN_UP:
				case LOGIN:
				case UPDATE_USER:
				case CONFIRM_EMAIL:
				case VERIFY_EMAIL:
				case GET_USER: {
					action.server = config.serverName;
					break;
				}

				case RESUME_SESSION: {
					if (!action.server) {
						action.server = config.serverName;
					}

					break;
				}

				case SOCKET_OPENED: {
					if (action.server === config.serverName) {
						const jwtToken = localStorage.getItem(localStorageTokenKey);

						if (jwtToken) {
							dispatch(resumeSession(jwtToken));
						} else {
							dispatch(noTokenFound());
						}
					}

					break;
				}

				case LOGIN_RESPONSE:
				case RESUME_SESSION_RESPONSE:
				case SIGN_UP_RESPONSE: {
					if (action.server === config.serverName && !action.error) {
						const state: AppState = getState();

						if (state.reduxSocketAuth.confirmEmailToken) {
							dispatch(confirmEmail(state.reduxSocketAuth.confirmEmailToken));
							dispatch(setConfirmEmailToken(null));
						}

						localStorage.setItem(localStorageTokenKey, action.payload.jwtToken);

						dispatch(tokenReceived(action.payload.jwtToken));
					}

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