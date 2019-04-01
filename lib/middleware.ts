import { Middleware, AnyAction } from 'redux';
import {
	LOGIN_RESPONSE,
	LOGOUT,
	RESUME_SESSION_RESPONSE,
	SIGN_UP_RESPONSE
} from './constants';
import {
	SOCKET_OPENED
} from 'redux-reconnecting-socket';
import { noTokenFound, resumeSession } from './actions';

const localStorageTokenKey = 'jwtToken';

export function reduxSocketAuth(): Middleware {
	return ({ dispatch }) => {
		return next => action => {

			switch (action.type) {
				case SOCKET_OPENED: {
					const jwtToken = localStorage.getItem(localStorageTokenKey);

					if (jwtToken) {
						dispatch(resumeSession(jwtToken));
					} else {
						dispatch(noTokenFound());
					}

					break;
				}

				case LOGIN_RESPONSE: {
					if (!action.error) {
						localStorage.setItem(localStorageTokenKey, action.payload.jwtToken);
					}

					break;
				}

				case RESUME_SESSION_RESPONSE: {
					if (!action.error) {
						localStorage.setItem(localStorageTokenKey, action.payload.jwtToken);
					}

					break;
				}

				case SIGN_UP_RESPONSE: {
					if (!action.error) {
						localStorage.setItem(localStorageTokenKey, action.payload.jwtToken);
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