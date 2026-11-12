import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import {ToastProvider} from 'react-toast-notifications'
import {ClientSocket} from "use-socketio";
import Store from "./Store";
import AppRouter from "./Store/router";
import {config} from "./config";

import App from "./App";
import "./index.scss";
import "react-datepicker/dist/react-datepicker.min.css";

ReactDOM.render(
    <ClientSocket url={config.api_realm}>
        <ToastProvider placement={'bottom-right'} autoDismiss={true} autoDismissTimeout={5000}>
            <AppRouter>
                <Store>
                    <App/>
                </Store>
            </AppRouter>
        </ToastProvider>
    </ClientSocket>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
