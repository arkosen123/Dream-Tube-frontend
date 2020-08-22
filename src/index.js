import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import './styles/search.css';
import './styles/play.css';
import './styles/profile.css';
import './styles/header.css';
import './styles/signup.css';
import './styles/login.css';
import './styles/user.css';
import './styles/footer.css';
import './styles/card.css';
import './styles/help.css';
import './styles/details.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
