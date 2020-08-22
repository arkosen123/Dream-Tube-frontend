import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const scroll = (() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

const Footer = ((props) => {
    return (
        <Navbar className="footer">
            <Nav className="footer">
                <Nav.Link className="foot-links" target="_blank" href="https://github.com/arkosen123"><span className="fa fa-github fa-lg logo"></span></Nav.Link>
                <Nav.Link className="foot-links" target="_blank" href="https://www.facebook.com/arko.sen.106"><span className="fa fa-facebook fa-lg logo"></span></Nav.Link>
                <Nav.Link className="foot-links" target="_blank" href="https://www.instagram.com/arkojyoti_sen/"><span className="fa fa-instagram fa-lg logo"></span></Nav.Link>
                <Navbar.Brand className="foot-scroll" onClick={() => scroll()}>Back to Top</Navbar.Brand>
            </Nav>
        </Navbar>
    )
});

export default Footer;