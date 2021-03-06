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
* react-router-dom
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
        // (more details in LOGIN_RESPONSE)
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

#### SIGN_UP
```js
{
    type: 'SIGN_UP',
    payload: {
        // note that the payload here can be anything you like, as long
        // as the server responds with a payload like:
        // { jwtToken: 'my_jwt_token' }
        // (more details in SIGN_UP_RESPONSE)
        username: 'test',
        password: 'secret'
    }
}
```

### Messages from server -> to client

#### LOGIN_RESPONSE
```js
{
    type: 'LOGIN_RESPONSE',
    error: false, // use true if it failed
    payload: {
        jwtToken: 'my_jwt_token',
        user: {
            role: 'admin', // optional
            // other properties are allowed, but not relevant to this
            // module
        }
    }
}
```

#### RESUME_SESSION_RESPONSE
```js
{
    type: 'RESUME_SESSION_RESPONSE',
    error: false, // use true if it failed
    payload: {
        jwtToken: 'my_jwt_token',
        user: {
            role: 'admin', // optional
            // other properties are allowed, but not relevant to this
            // module
        }
    }
}
```

#### SIGN_UP_RESPONSE
```js
{
    type: 'SIGN_UP_RESPONSE',
    error: false, // use true if it failed
    payload: {
        jwtToken: 'my_jwt_token',
        user: {
            role: 'admin', // optional
            // other properties are allowed, but not relevant to this
            // module
        }
    }
}
```

You might have noticed that `LOGIN_RESPONSE`, `RESUME_SESSION_RESPONSE`
and `SIGN_UP_RESPONSE` have identical message structures. This is
correct.

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
            reduxSocketAuth(),
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

### 5. Signing up
```js
import { signUp } from 'redux-socket-auth';

class SignUpForm extends React.Component {
    ...

    onSubmit() {
        const { dispatch } = this.props;
        const { username, password, email, name } = this.state;

        const promise = dispatch(signUp({
            username,
            password,
            email,
            name
        }));

        promise.then(() => {
            // Redirect the user after successful signup
            history.push('/dashboard');
        });

        promise.catch(messageFromServer =>
            this.setState({ errors: JSON.stringify(messageFromServer) })
        );
    }

    ...
}
```


### 6. Logging in
```js
import { login } from 'redux-socket-auth';

class LoginForm extends React.Component {
    ...

    onSubmit() {
        const { dispatch } = this.props;
        const { username, password } = this.state;

        const promise = dispatch(login({ username, password }));

        promise.then(() => {
            // Redirect the user after successful login
            history.push('/dashboard');
        });

        promise.catch(messageFromServer =>
            this.setState({ errors: JSON.stringify(messageFromServer) })
        );
    }

    ...
}
```

### 7. Logging out
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

### 8. Displaying user info
```js
class UserInfo extends React.Component {
    render() {
        const { user } = this.props;

        return (
            <p>{user.name}</p>
        }
    }
}

const select = (state) => ({
    user: state.reduxSocketAuth.user
});

export default connect(select)(UserInfo);
```

### 9. Updating the user
```js
import { updateUser } from 'redux-socket-auth';

dispatch(updateUser({ email: 'test@test.com', name: 'test' }));
```

### 10. Email confirmation
Typically you might send a confirmation email to a new user after they
sign up. The confirmation email contains a token.

Step 1: Get the token from the URL and save it in the store
```js
import { setConfirmEmailToken } from 'redux-socket-auth';

dispatch(setConfirmEmailToken(urlParams.get('token')));
```

Step 2: When the user logs in (or resumes his session), the CONFIRM_EMAIL
action with the token will automatically be sent to the server.

### 11. Resending verification email
```js
import { verifyEmail } from 'redux-socket-auth';

dispatch(verifyEmail());
```