import React, {useEffect, useState} from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie'

import UserList from './components/UsersList';
import LoginForm from './components/LoginForm';
import UserForm from './components/UserForm';
import AuthContext from './auth'

function App() {
    const [fetchWithCSRF, setFetchWithCSRF] = useState(() => fetch);
    const authContextValue = {
        fetchWithCSRF,
    };
    useEffect(() => {
        async function restoreCSRF() {
            const response = await fetch('/api/csrf/restore', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const authData = await response.json();
                console.log(Cookies.get())
                setFetchWithCSRF(() => {
                    return (resource, init) => {
                        if (init.headers) {
                            init.headers['X-CSRFToken'] = authData.csrf_token;
                        } else {
                            init.headers = {
                                'X-CSRFToken': authData.csrf_token
                            }
                        }
                        return fetch(resource, init);
                    }
                });
            }
        }
        restoreCSRF();
    }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
        <BrowserRouter>
            <nav>
                <ul>
                    <li><NavLink to="/" activeclass="active">Home</NavLink></li>
                    <li><NavLink to="/login" activeclass="active">Login</NavLink></li>
                    <li><NavLink to="/users" activeclass="active">Users</NavLink></li>
                </ul>
            </nav>
            <Switch>
                <Route path="/users" exact={true}>
                    <UserList />
                </Route>
                <Route path="/users/:id/edit" component={UserForm} />
                <Route path="/login" component={LoginForm} />
                <Route path="/">
                    <h1>My Home Page</h1>
                </Route>
            </Switch>
        </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;