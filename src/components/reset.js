import React, { Component } from 'react';
import baseUrl from '../shared/baseUrl';
import { Row, Col, Label, Button } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Redirect } from 'react-router-dom';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => (!(required(val))) || (!(val) || (val.length <= len));
const minLength = (len) => (val) => (!(required(val))) || ((val) && (val.length >= len));

class Reset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: 0,
            error: false,
            redirect: null,
            user: null,
            hideInitial: "password",
            hideConfirm: "password",
        }
        this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
        this.handleSubmitReset = this.handleSubmitReset.bind(this);
        this.toggleHideInitial = this.toggleHideInitial.bind(this);
        this.toggleHideConfirm = this.toggleHideConfirm.bind(this);
    }

    toggleHideInitial() {
        if (this.state.hideInitial === "password") this.setState({ hideInitial: "text" });
        else this.setState({ hideInitial: "password" });
    }

    toggleHideConfirm() {
        if (this.state.hideConfirm === "password") this.setState({ hideConfirm: "text" });
        else this.setState({ hideConfirm: "password" });
    }

    handleSubmitUsername(values) {
        fetch(baseUrl + 'user/exist/' + values.username)
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
            .then(response => {
                if (response.exists === true) {
                    this.setState({ show: 1, user: response.user });
                }
                else this.setState({ error: true });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleSubmitReset(values) {
        if (values.password !== values.confirmPassword) {
            this.setState({ error: true });
            return;
        }
        fetch(baseUrl + 'modify/' + this.state.user.username)
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
                const userData = this.state.user;
                userData.password = values.password;
                fetch(baseUrl + 'signup/', {
                    method: "POST",
                    body: JSON.stringify(userData),
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
                        localStorage.clear();
                        this.setState({ redirect: '/user' });
                    })
                    .catch(error => { });
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        if (this.state.redirect) {
            this.props.changeMessage("Password changed!.. Just login again and keep Browsing.");
            return <Redirect to={this.state.redirect} />
        }

        const error = (() => {
            if (this.state.error) {
                return (
                    <div>No such Username exists. Please check and try again.</div>
                )
            }
            else return (<div></div>)
        })

        const display = (() => {
            if (this.state.show === 0) {
                return (
                    <div className="reset-display">
                        <div className="reset-heading">Forgot Password</div>
                        <div className="reset-sub-heading">Type your existing Username</div>
                        <LocalForm model="feedback" onSubmit={(values) => this.handleSubmitUsername(values)}>
                            <Row className="form-group mt-3">
                                <Label className="labels col-3" htmlFor="username">Username</Label>
                                <Col className="col-9">
                                    <Control.text spellCheck="false" model=".username" id="username" name="username"
                                        placeholder="Username"
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
                            <Row>
                                <Col className="col-10 offset-2">
                                    <div className="reset-error" >{error()}</div>
                                </Col>
                            </Row>
                            <Row className="form-group mt-3">
                                <Col className="col-9 offset-3">
                                    <Button className="reset-btn" type="submit" color="primary">Confirm</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </div>
                )
            }
            else {
                return (
                    <div className="reset-display">
                        <div className="reset-heading">Forgot Password</div>
                        <div className="reset-sub-heading">Set the new Password</div>
                        <Row>
                            <Col>
                                <LocalForm model="feedback" onSubmit={(values) => this.handleSubmitReset(values)}>
                                    <Row className="form-group mt-3">
                                        <Label className="labels col-3" htmlFor="password">New Password</Label>
                                        <Col className="mt-3 col-9">
                                            <Control.text type={this.state.hideInitial} model=".password" id="password" name="password"
                                                placeholder="New Password"
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
                                        </Col>
                                        <span className="fa fa-eye hide-icon hide-initial" onClick={() => this.toggleHideInitial()}></span>
                                    </Row>
                                    <Row className="form-group mt-3">
                                        <Label className="labels col-3" htmlFor="confirmPassword">Confirm Password</Label>
                                        <Col className="mt-3 col-9">
                                            <Control.text type={this.state.hideConfirm} model=".confirmPassword" id="confirmPassword" name="confirmPassword"
                                                placeholder="Confirm Password"
                                                className="form-control"
                                                validators={{
                                                    required, minLength: minLength(4), maxLength: maxLength(15)
                                                }}
                                            />
                                            <Errors
                                                className="text-danger"
                                                model=".confirmPassword"
                                                show="touched"
                                                messages={{
                                                    required: 'Required',
                                                    minLength: 'Must be greater than 4 characters',
                                                    maxLength: 'Must be 15 characters or less'
                                                }}
                                            />
                                        </Col>
                                        <span className="fa fa-eye hide-icon hide-confirm" onClick={() => this.toggleHideConfirm()}></span>
                                    </Row>
                                    <Row>
                                        <Col className="col-10 offset-2">
                                            <div className="reset-error" >{error()}</div>
                                        </Col>
                                    </Row>
                                    <Row className="form-group mt-3">
                                        <Col className="col-9 offset-3">
                                            <Button className="reset-btn" type="submit" color="primary">Reset</Button>
                                        </Col>
                                    </Row>
                                </LocalForm>
                            </Col>
                        </Row>
                    </div>
                )
            }
        })

        return (
            <div className="reset-background">
                {display()}
            </div>
        )
    }
}

export default Reset;