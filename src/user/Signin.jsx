import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Spinner from "../core/Spinner";
import { signin, authenticate } from "../auth";
import SocialLogin from "./SocialLogin";

export default class Signin extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    redirectToReferer: false,
    loading: false
  };

  handleChange = e => {
    this.setState({ error: "" });
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  clickSubmit = e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { email, password } = this.state;
    const user = { email, password };
    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true, loading: false });
        });
      }
    });
  };

  render() {
    if (this.state.redirectToReferer) {
      return <Redirect to="/" />;
    }

    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <div className="container">
        <h2
          className="mt-5"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
        >
          Sign In
        </h2>

        <hr />
        <SocialLogin />
        <hr />

        <div
          className="alert alert-danger"
          style={{ display: !this.state.error && "none" }}
        >
          {this.state.error}
        </div>
        <h4
          className="mt-2 text-center"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "2.8rem" }}
        >
          Or
        </h4>
        <form>
          <div className="form-group">
            <label className="bmd-label-floating">Email</label>
            <input
              onChange={this.handleChange}
              name="email"
              type="email"
              value={this.state.email}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-floating">Password</label>
            <input
              onChange={this.handleChange}
              name="password"
              type="password"
              value={this.state.password}
              className="form-control"
            />
          </div>
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary"
          >
            Sign In
          </button>
        </form>
        <p>
          <Link to="/forgot-password" className="btn btn-danger mt-2">
            Forgot Password?
          </Link>
        </p>
      </div>
    );
  }
}
