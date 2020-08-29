import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import history from '../history';
import baseUrl from '../shared/baseUrl';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
        }
        this.handleHelp = this.handleHelp.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleGuest = this.handleGuest.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    }

    handleHelp() {
        history.push('/user');
        this.setState({ redirect: '/help' });
    }

    handleLogin() {
        history.push('/user');
        this.setState({ redirect: '/user/login' });
    }

    handleSignup() {
        history.push('/user');
        this.setState({ redirect: '/user/signup' });
    }

    handleGuest() {
        const val = {
            username: 'guest',
            password: 'pass',
        }

        fetch(baseUrl + 'login/', {
            method: "POST",
            body: JSON.stringify(val),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.err);
                    error.response = response;
                    throw error;
                }
            },
                error => {
                    throw error;
                })
            .then(response => response.json())
            .then(user => {
                if (user.success) {
                    localStorage.setItem('token', user.token);
                    const credential = user.user;
                    localStorage.setItem('currentUser', JSON.stringify(credential));
                    history.push('/user');
                    this.setState({ redirect: "/home" });
                }
                else {
                    var error = new Error('Error ' + user.status);
                    error.response = user;
                    throw error;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        if (this.state.redirect) {
            this.props.changeMessage(null);
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className="user-background">
                <div className="user-message">{this.props.message}</div>
                <div className="user-form">
                    <div className="user-btn">
                        <Button className="user-button" onClick={() => this.handleLogin()}>Login</Button>
                    </div>
                    <div className="user-btn">
                        <Button className="user-button" onClick={() => this.handleSignup()}>SignUp</Button>
                    </div>
                    <div className="user-btn">
                        <Button className="user-button" onClick={() => this.handleGuest()}>Login as Guest</Button>
                    </div>
                    <div className="user-help">
                        <Button className="user-button user-button-help" onClick={() => this.handleHelp()} >Know More</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default User;