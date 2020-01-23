import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ddd" };
  else return { color: "#ffffff" };
};

function Menu({ history }) {
  return (
    <>
      <nav className="navbar navbar-expand-lg nav-tabs bg-primary sticky-top">
        <Link className="navbar-brand" style={{ color: "#fff" }} to="/">
          Social Square
        </Link>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, "/")} to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/users")}
                to="/users"
              >
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/create/post`}
                style={isActive(history, `/create/post`)}
              >
                Create Post
              </Link>
            </li>

            {!isAuthenticated() && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={isActive(history, "/signin")}
                    to="/signin"
                  >
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={isActive(history, "/signup")}
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated() && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/findpeople`}
                    style={isActive(history, `/findpeople`)}
                  >
                    Find People
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/user/${isAuthenticated().user._id}`}
                    style={isActive(
                      history,
                      `/user/${isAuthenticated().user._id}`
                    )}
                  >
                    {`${isAuthenticated().user.name}`}
                  </Link>
                </li>
                <li className="nav-item my-2 my-lg-0">
                  <Link
                    to="#"
                    className="nav-link"
                    style={
                      (isActive(history, "/signup"),
                      { cursor: "pointer", color: "#fff" })
                    }
                    onClick={() => signout(() => history.push("/"))}
                  >
                    Sign Out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default withRouter(Menu);
