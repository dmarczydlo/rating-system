import React from 'react';
import {Route} from 'react-router-dom';
import Home from '../sites/home';
import Players from '../sites/players';

export const routes = [
    {
        component: Home,
        exact: true,
        path: '/'
    },
    {
        component: Players,
        path: '/players/:listId/:arbiters'
    }
];

export const RouteWithSubRoutes = (route, key) => (
    <Route
        exact={route.exact}
        key={key}
        path={route.path}
        render={(props) => (
            <route.component
                {...props}
                routes={route.routes}
            />
        )}
    />
);
