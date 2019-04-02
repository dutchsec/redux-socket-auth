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
import {
	confirmEmail,
	noTokenFound,
	resumeSession,
	setConfirmEmailToken
} from './actions';
import { AppState } from './reducer';

const localStorageTokenKey = 'jwtToken';

export function reduxSocketAuth(): Middleware {
	return ({ dispatch, getState }) => {
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

				case LOGIN_RESPONSE:
				case RESUME_SESSION_RESPONSE:
				case SIGN_UP_RESPONSE: {
					if (!action.error) {
						const state: AppState = getState();

						if (state.reduxSocketAuth.confirmEmailToken) {
							dispatch(confirmEmail(state.reduxSocketAuth.confirmEmailToken));
							dispatch(setConfirmEmailToken(null));
						}

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