import React, { Component } from 'react';
import baseUrl from '../shared/baseUrl';
import VideoCard from './videoCard';
import { Redirect, Link } from 'react-router-dom';
import history from '../history';
import Header from './header';
import { Row, Col, Label, Button, FormGroup, Input } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';


const required = (val) => val ;
const maxLength = (len) => (val) => {
    if(val && val.length) return(val.length <= len);
    else return true;
}
const minLength = (len) => (val) => {
    if(val && val.length) return(val.length >= len);
    else return true;
}
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: JSON.parse(localStorage.getItem('currentUser')).username,
            favouriteList: null,
            val: 0,
            searched: false,
            redirect: null,
            user: JSON.parse(localStorage.getItem('currentUser')),
            openInfo: false,
            openFav: false,
            openEdit: false,
            editState: null,
            checked: true,
        }
        this.getFavourites = this.getFavourites.bind(this);
        this.handleIcon = this.handleIcon.bind(this);
        this.handleVideo = this.handleVideo.bind(this);
        this.handleAudio = this.handleAudio.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.showUserInfo = this.showUserInfo.bind(this);
        this.editUser = this.editUser.bind(this);
        this.editNormalInfo = this.editNormalInfo.bind(this);
        this.editDelete = this.editDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.changeCheck = this.changeCheck.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changeCheck() {
        const initialCheck = this.state.checked;
        this.setState({ checked: !initialCheck });
    }

    handleVideo(id) {
        const url = baseUrl + 'download/video/' + id;
        window.open(
            url,
            "_blank");
    }

    handleAudio(id) {
        const url = baseUrl + 'download/audio/' + id;
        window.open(
            url,
            "_blank");
    }

    handlePlay(id) {
        const url = '/play/' + id;
        this.setState({ redirect: url });
    }

    handleIcon(index) {
        const clickedVideo = this.state.favouriteList.slice();
        clickedVideo.splice(index, 1);
        fetch(baseUrl + 'favourite/modify/' + this.state.favouriteList[index].id + '/' + this.state.username)
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
            .then(response => {
                this.setState({ favouriteList: clickedVideo },() => {
                    if(this.state.favouriteList.length === 0) {
                        this.setState({ searched : false});
                    }
                });
            })
    }

    editUser() {
        const initialState = this.state.openEdit;
        if(initialState === true) this.setState({ openEdit: !initialState, editState: null });
        else this.setState({ openEdit: !initialState });
    }

    showUserInfo() {
        const initialState = this.state.openInfo;
        this.setState({ openInfo: !initialState })
    }

    getFavourites() {
        const open = this.state.openFav;
        this.setState({ openFav: !open });
        if (this.state.favouriteList) {
            const initialState = this.state.searched;
            this.setState({ searched: !initialState });
            return;
        }
        fetch(baseUrl + 'favourite/' + this.state.username)
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
            .then(response => {
                return response.json();
            })
            .then(response => {
                const videoIds = response;
                for (let items = 0; items < videoIds.length; items++) {
                    fetch(baseUrl + 'download/videos/' + videoIds[items].videoId)
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
                        .then(response => {
                            return response.json();
                        })
                        .then((response) => {
                            response = JSON.parse(response);
                            const val = this.state.val;
                            const videos = (this.state.favouriteList !== null) ? this.state.favouriteList.slice() : [];
                            response.items[0].favourite = true;
                            videos.push(response.items[0]);
                            this.setState({ favouriteList: videos, val: val + 1 }, () => {
                                if (this.state.val === videoIds.length) this.setState({ searched: true });
                            });
                        })
                }
            })
            .catch(error => { console.log(error) });
    }

    editNormalInfo() {
        const initialState = this.state.editState;
        if(initialState !== 1) this.setState({ editState: 1 });
        else this.setState({ editState: null });
    }

    editDelete() {
        const initialState = this.state.editState;
        if(initialState !== 2) this.setState({ editState: 2 });
        else this.setState({ editState: null });
    }

    changePassword() {
        history.push('/profile');
        this.setState({ redirect: '/reset'});
    }

    deleteAccount() {
        fetch(baseUrl + 'modify/' + this.state.username)
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
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleSubmit(values) {
        fetch(baseUrl + 'modify/' + this.state.username, {
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
                localStorage.setItem('currentUser', JSON.stringify(user));
                history.push('/profile');
                this.setState({ redirect: "/home" })
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    render() {
        
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const openStateView = (() => {
            if(this.state.openEdit) {
                if(this.state.editState === 1 ) {
                    return (
                        <div classname="editStateOne">
                            <LocalForm model="feedback" onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="telnum" sm={3}>Phone No.</Label>
                                    <Col sm={9}>
                                        <Control.text model=".telnum" id="telnum" name="telnum"
                                            placeholder="Phone Number"
                                            defaultValue={this.state.user.telnum}
                                            spellCheck="false"
                                            className="form-control"
                                            validators={{
                                                required, minLength:minLength(8), maxLength:maxLength(12), isNumber
                                            }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".telnum"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 8 characters',
                                                maxLength: 'Must be 12 characters or less',
                                                isNumber: 'Must be a number'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group mt-3">
                                    <Label className="labels" htmlFor="email" sm={3}>Email Id</Label>
                                    <Col sm={9}>
                                        <Control.text model=".email" id="email" name="email"
                                            placeholder="Email Id"
                                            defaultValue={this.state.user.email}
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
                                    <Label className="labels" htmlFor="countryCode" sm={3}>Country Code</Label>
                                    <Col sm={9}>
                                        <Control.text model=".countryCode" id="countryCode" name="countryCode"
                                            defaultValue={this.state.user.countryCode}
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
                                    <Col sm={{ size: 9, offset: 3 }}>
                                        <Button className="details-btn" type="submit" color="primary">Edit Details</Button>
                                    </Col>
                                </Row>
                            </LocalForm>
                        </div>
                    )
                }
                else if(this.state.editState === 2) {
                    return(
                        <div className="confirm-details">
                            <FormGroup className="mb-3" check>
                                <Label check><Input type="checkbox" onChange={() => this.changeCheck()} /> Do you really want to delete Account? </Label>
                            </FormGroup>
                            <Button disabled={this.state.checked} onClick={() => this.deleteAccount()} className="details-btn mb-4" type="submit" color="danger">Delete</Button>
                        </div>
                    )
                }
            }
            else return (<div></div>)
        })

        const user = (() => {
            if (this.state.openInfo) {
                return (
                    <div className="profile-user">
                        <ul className="list-unstyled">
                            <li>Username : {this.state.user.username}</li>
                            <li>Phone No. : {this.state.user.telnum}</li>
                            <li>Email Id : {this.state.user.email}</li>
                            <li>Country Code : {this.state.user.countryCode}</li>
                        </ul>
                        <div>Hope you have a very nice Day.</div>
                    </div>
                )
            }
            else return (<div></div>)
        })

        const edit = (() => {
            if (this.state.openEdit) {
                return (
                    <div className="edit-btn-group">
                        <Button className="edit-btn btn-warning" onClick={() => this.editNormalInfo()}>Edit Details</Button>
                        <Button className="edit-btn btn-warning" onClick={() => this.changePassword()}>Change Password</Button>
                        <Button className="edit-btn btn-warning" onClick={() => this.editDelete()}>Delete Account</Button>
                    </div>
                )
            }
            else return (<div></div>)
        })

        const list = (() => {
            if (this.state.searched) {
                return (
                    <div> {
                        this.state.favouriteList.map((item, index) => {
                            const icon = 'fa-heart';
                            return (
                                <VideoCard index={index} icon={icon} item={item} id={item.id} handleIcon={(index) => this.handleIcon(index)} handleVideo={(id) => this.handleVideo(id)} handlePlay={(id) => this.handlePlay(id)} handleAudio={(id) => this.handleAudio(id)} ></VideoCard>
                            )
                        })
                    }
                    </div>                       
                )
            }
            else if (this.state.openFav === true) {
                return(
                    <div className="no-search">No Videos saved as Favourites!....Don't miss out to add some</div>
                )
            }
            else return (<div></div>)
        });
        return (
            <div>
                <Header></Header>
                <div className="profile-display">
                    <Button className="profile-btn btn-warning" onClick={() => this.showUserInfo()} >User Info</Button>
                    {user()}
                    <Button className="profile-btn btn-warning" onClick={() => this.getFavourites()} >Favourites</Button>
                    <div className="fav-videos">{list()}</div>
                    <Link className="profile-link" to='/help'><Button className="profile-btn btn-warning" >Know More</Button></Link>
                    <Button className="profile-btn btn-warning" onClick={() => this.editUser()} >Edit User Details</Button>
                    {edit()}
                    {openStateView()}
                </div>
            </div>
        )
    }
}

export default Profile;