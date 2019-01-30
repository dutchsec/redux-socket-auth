# Redux Socket Auth

Opionated full user/authentication/ACL solution for projects with:
* React
* React-router
* Redux
* Websockets

Features:
* Signup
* Login/logout
* Stores a session token in local storage to automatically resume sessions
* Defining routes that are only accessible for logged in users
* ACL: define per route which roles can access it
* All communication with the server happens over web sockets

**Warning: because this is an opionated, fully functional solution, you will
need to configure your server in a very specific way.**

## Dependencies

There are a number of peer dependencies that your project needs to
include:
* react
* react-redux
* react-router
* react-router-dom
* react-router-redux
* redux
* redux-reconnecting-socket

## Server config (API spec)

### Messages from client -> to server

#### LOGIN
```js
{
    type: 'LOGIN',
    payload: {
        // note that the payload here can be anything you like, as long
        // as the server responds with a payload like:
        // { jwtToken: 'my_jwt_token' }
        // (more details in LOGIN_SUCCESS)
        username: 'test',
        password: 'secret'
    }
}
```

#### RESUME_SESSION
```js
{
    type: 'RESUME_SESSION',
    payload: {
        jwtToken: 'my_jwt_token'
    }
}
```

### Messages from server -> to client

#### LOGIN_SUCCESS
```js
{
    type: 'LOGIN_SUCCESS',
    payload: {
        jwtToken: 'my_jwt_token'
    }
}
```

#### LOGIN_FAILED
```js
{
    type: 'LOGIN_FAILED'
}
```

#### RESUME_SESSION_SUCCESS
```js
{
    type: 'RESUME_SESSION_SUCCESS',
    payload: {
        jwtToken: 'my_jwt_token'
    }
}
```

#### RESUME_SESSION_FAILED
```js
{
    type: 'RESUME_SESSION_FAILED'
}
```

## Clientside installation

### 1. Installation
```bash
npm install redux-socket-auth
```

### 2. Configuring the middleware
```js
import { reduxSocketAuth } from 'redux-socket-auth';

const store = createStore(
    rootReducer(history),
    initialState,
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
            reduxSocketAuth({
                redirects: {
                    loginSuccess: '/dashboard',
                    resumeSessionFailed: '/login'
                }
            }),
            reduxReconnectingSocket(),
        ),
    )
);
```

### 3. Configuring the reducer
```js
import { reduxSocketAuthReducer } from 'redux-socket-auth';

export const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
	connection: reduxReconnectingSocketReducer,
	reduxSocketAuth: reduxSocketAuthReducer
});
```

### 4. Defining routes
```js
import { Switch, Route } from 'react-router-dom';
import { AuthRoute, UnauthRoute } from 'redux-socket-auth';

class App extends React.Component {
    render() {
        const { isAuthenticating, connected } = this.props;

        if (isAuthenticating || !connected) {
            // This is required!
            // Otherwise the user would get redirected to the login form
            // before the authentication process is completed
            return 'Fancy loading spinner';
        }

        return (
            <Switch>
                <AuthRoute
                    exact={true}
                    component={MyProtectedComponent}
                    path="/protected"
                    redirectTo="/login"
                />
                <AuthRoute
                    exact={true}
                    component={AdminsOnlyComponent}
                    path="/admins-only"
                    redirectTo="/login"
                    roles={['admin']}
                />
                <UnauthRoute
                    exact={true}
                    component={LoginForm}
                    path="/login"
                    redirectTo="/protected"
                />
                <Route
                    exact={true}
                    component={MyPublicComponent}
                    path="/always-accessible"
                />
            </Switch>
        );
    }
}

const select = (state) => ({
    isAuthenticating: state.reduxSocketAuth.isAuthenticating,
    connected: state.connection.connected
});

export default connect(select)(App);
```

### 5. Logging in
```js
import { login } from 'redux-socket-auth';

class LoginForm extends React.Component {
    ...

    onSubmit() {
        const { dispatch } = this.props;
        const { username, password } = this.state;

        dispatch(login({ username, password }));
        // The user will automatically be redirected on LOGIN_SUCCESS
        // to the path you defined while configuring the middleware
    }

    ...
}
```

### 6. Logging out
```js
import { logout } from 'redux-socket-auth';

class LogoutButton extends React.Component {
    ...

    onClick() {
        const { dispatch } = this.props;

        dispatch(logout());
    }

    ...
}
```