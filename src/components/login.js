import React, { Component } from 'react';
import baseUrl from '../shared/baseUrl';
import { Row, Col, Label, Button } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Redirect } from 'react-router-dom';
import history from '../history';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => (!(required(val))) || (!(val) || (val.length <= len));
const minLength = (len) => (val) => (!(required(val))) || ((val) && (val.length >= len));

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            error: false,
            hide: "password",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetPass = this.resetPass.bind(this);
        this.toggleHide = this.toggleHide.bind(this);
    }

    resetPass() {
        history.push('/user/login');
        this.setState({ redirect: '/reset' })
    }

    toggleHide() {
        if(this.state.hide === "password") this.setState({ hide: "text"});
        else this.setState({ hide: "password"}); 
    }

    handleSubmit(values) {
        fetch(baseUrl + 'login/', {
            method: "POST",
            body: JSON.stringify(values),
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
                this.setState({ error: true });
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const errorLine = (this.state.error) ? "No user with this Username and Password! Sign up first." : "";
        return (
            <div className="login-background">
                <div className="login-logo">
                    <span className="login-logo-text">LOGIN FORM</span>
                </div>
                <div className="login-form">
                    <Row>
                        <Col sm={8} className="offset-1 offset-sm-4 mt-4 error">{errorLine}</Col>
                    </Row>
                    <Row>
                        <Col sm={8} className=" offset-1 offset-sm-2 col-10">
                            <LocalForm model="feedback" onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="username" sm={3}>Username</Label>
                                    <Col sm={9}>
                                        <Control.text model=".username" id="username" name="username"
                                            placeholder="Username" spellCheck= "false"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(4), maxLength: maxLength(15)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".username"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 4 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="password" sm={3}>Password</Label>
                                    <Col sm={9}>
                                        <Control.text type={this.state.hide} model=".password" id="password" name="password" spellCheck= "false"
                                            placeholder="Password"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(4), maxLength: maxLength(15)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".password"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 4 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                        />
                                        <span className="fa fa-eye hide-icon" onClick={() => this.toggleHide()}></span>
                                    </Col>
                                </Row>
                                <Row className="form-group ml-1">
                                    <div className="reset-password" onClick={() => this.resetPass()}>Forgot Password? click here</div>
                                </Row>
                                <Row className="form-group">
                                    <Col sm={{ size: 9, offset: 3 }}>
                                        <Button className="login-btn" type="submit" color="primary"><strong>Login</strong></Button>
                                    </Col>
                                </Row>
                            </LocalForm>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Login;