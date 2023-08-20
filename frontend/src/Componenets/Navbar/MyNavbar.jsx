import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../../Context/Auth/AuthContext";
import { MdLogout } from "react-icons/md";
import useToast from "../../Hooks/useToast";
import { decodeToken } from "react-jwt";
import CartItemList from "../Cart/Cart";
import { NavDropdown } from "react-bootstrap";

const NavLinks = () => (
  <>
    <NavLink className="nav-link mx-1" to="/">
      Home
    </NavLink>
    <NavLink className="nav-link mx-1" to="/books">
      Books
    </NavLink>
    <NavLink className="nav-link mx-1" to="/categories">
      Categories
    </NavLink>
    <NavLink className="nav-link mx-1" to="/publishers">
      Publishers
    </NavLink>
  </>
);

const MyNavbar = () => {
  const { state, dispatch } = useContext(AuthContext);
  const showToast = useToast();
  const logoutUser = () => {
    dispatch({ type: "LOGOUT_USER" });
    showToast("success", "User logged out", 100, 1500);
  };

  const decodeUser = (token) => {
    if (!token) {
      return undefined;
    } else {
      const res = decodeToken(token);
      return { username: res?.username, token: res?.role };
    }
  };
  const currentUser = decodeUser(state.token);
  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="sm"
      className="w-100 min-vw-100"
    >
      <Container>
        <Navbar.Brand>
          <NavLink
            to={"/"}
            className="text-decoration-none color-green fw-bolder ms-2"
          >
            BookHarbor
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-1" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-between flex-grow-1 text-gray-200 align-baseline my-1">
            <div className="d-flex flex-column flex-sm-row">{<NavLinks />}</div>
            <div className="d-flex flex-row">
              {currentUser && currentUser.token === "admin" ? (
                <>
                  {/* Show admin-specific link(s) */}
                  <NavLink className="nav-link mx-1" to="/admin-panel/">
                    Admin Panel
                  </NavLink>
                  <MdLogout
                    size={28}
                    color="red"
                    className="align-self-center ms-2 cursor-pointer"
                    onClick={() => logoutUser()}
                  />
                </>
              ) : currentUser && currentUser?.token ? (
                <>
                  <NavDropdown
                    title={currentUser.username}
                    className="color-green align-self-center"
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item href="/orders">Orders</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => logoutUser()}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  <CartItemList />
                </>
              ) : (
                // Guest
                <>
                  {/* Show login and signup */}
                  <NavLink to="/login" className="btn color-green">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="btn color-green">
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
