import React, { Component } from 'react';
import { Button, Nav, NavItem } from 'reactstrap';
import { Redirect, Link } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            active: window.location.pathname,
            username: JSON.parse(localStorage.getItem('currentUser')).username,
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        localStorage.clear();
        this.setState({ redirect: '/user' });
        window.location.reload();
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        return (
            <div className="header">
                <Nav className="mr-auto links-bar" >
                    <NavItem className="head-items">
                        <Link className="random-link" to="/home"><Button active={this.state.active !== '/trending' && this.state.active !== '/profile'} className="link-buttons-header">Home</Button></Link>
                    </NavItem>
                    <NavItem className="head-items">
                        <Link className="random-link" to="/trending"><Button active={this.state.active === '/trending'} className="link-buttons-header">Trending</Button></Link>
                    </NavItem>
                    <NavItem className="head-items">
                        <Link className="random-link" to="/profile"><Button disabled={this.state.username === 'guest'} active={this.state.active === '/profile'} className="link-buttons-header">Profile</Button></Link>
                    </NavItem>
                </Nav>
                <Button className="btn-danger logout-btn" onClick={() => this.handleLogout()} >Logout</Button>
            </div>
        )
    }
}

export default Header;