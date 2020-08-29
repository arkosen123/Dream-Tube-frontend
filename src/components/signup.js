import React, { Component } from 'react';
import baseUrl from '../shared/baseUrl';
import { Row, Col, Label, Button } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Redirect } from 'react-router-dom';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => (!(required(val))) || (!(val) || (val.length <= len));
const minLength = (len) => (val) => (!(required(val))) || ((val) && (val.length >= len));
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            error: false,
            hide: "password",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleHide = this.toggleHide.bind(this);
    }

    toggleHide() {
        if (this.state.hide === "password") this.setState({ hide: "text" });
        else this.setState({ hide: "password" });
    }

    handleSubmit(values) {
        fetch(baseUrl + 'signup/', {
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
                this.setState({ redirect: "/user" })
            })
            .catch(error => {
                console.log(error);
                this.setState({ error: true });
            });
    }

    render() {
        if (this.state.redirect) {
            this.props.changeMessage("Signup successful!.. Now just login and get started");
            return <Redirect to={this.state.redirect} />
        }

        const errorLine = (this.state.error) ? "UserName already taken!" : "";
        return (
            <div className="signup-background">
                <div className="signup-logo">
                    <span className="signup-logo-text">SIGNUP FORM</span>
                </div>
                <div className="signup-form">
                    <Row>
                        <Col sm={8} className="offset-1 offset-sm-4 mt-4 error">{errorLine}</Col>
                    </Row>
                    <Row>
                        <Col sm={8} className="offset-sm-2">
                            <LocalForm model="feedback" onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="username" sm={2}>Username</Label>
                                    <Col sm={10}>
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
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="password" sm={2}>Password</Label>
                                    <Col sm={10}>
                                        <Control.text type={this.state.hide} model=".password" id="password" name="password"
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
                                    </Col>
                                    <span className="fa fa-eye hide-icon hide-icon-signup" onClick={() => this.toggleHide()}></span>
                                </Row>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="telnum" sm={2}>Phone No.</Label>
                                    <Col sm={10}>
                                        <Control.text model=".telnum" id="telnum" name="telnum"
                                            placeholder="Phone Number"
                                            spellCheck="false"
                                            className="form-control"
                                            validators={{
                                                maxLength: maxLength(12), isNumber
                                            }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".telnum"
                                            show="touched"
                                            messages={{
                                                maxLength: 'Must be 12 numbers or less',
                                                isNumber: 'Must be a number'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="email" sm={2}>Email Id</Label>
                                    <Col sm={10}>
                                        <Control.text model=".email" id="email" name="email"
                                            placeholder="Email Id"
                                            spellCheck="false"
                                            className="form-control"
                                            validators={{
                                                validEmail
                                            }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".email"
                                            show="touched"
                                            messages={{
                                                validEmail: 'Not a correct E-mail id'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="countryCode" sm={2}>Country Code</Label>
                                    <Col sm={10}>
                                        <Control.text model=".countryCode" id="countryCode" name="countryCode"
                                            placeholder="ISO 3166-1 alpha-2 Code like IN"
                                            className="form-control"
                                            spellCheck="false"
                                            validators={{
                                                required, minLength: minLength(2), maxLength: maxLength(2)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".countryCode"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be 2 characters',
                                                maxLength: 'Must be 2 characters'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col sm={{ size: 10, offset: 2 }}>
                                        <Button className="signup-btn" type="submit" color="primary">Sign Up</Button>
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

export default Signup;