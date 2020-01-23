import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import avatar from "../images/avatar.png";
import Spinner from "../core/Spinner";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./userapi";

export default class EditProfile extends Component {
  state = {
    id: "",
    name: "",
    email: "",
    bio: "",
    password: "",
    error: "",
    redirectToProfile: false,
    fileSize: 0,
    loading: false
  };

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          bio: data.bio,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();

    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  handleChange = e => {
    this.setState({ error: "" });
    const value =
      e.target.name === "photo" ? e.target.files[0] : e.target.value;
    const fileSize = e.target.name === "photo" ? e.target.files[0].size : 0;
    this.userData.set(e.target.name, value);
    this.setState({
      [e.target.name]: value,
      fileSize
    });
  };

  //   Client Side Validation
  isValid = () => {
    const { email, name, password, fileSize } = this.state;

    if (fileSize > 2500000) {
      this.setState({
        loading: false,
        error: "File size should be less than 2.5 mb"
      });
      return false;
    }

    if (name.length === 0) {
      this.setState({
        loading: false,
        error: "Name is required"
      });
      return false;
    }

    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!re.test(email)) {
      this.setState({
        loading: false,
        error: "Email is invalid"
      });
      return false;
    }

    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        loading: false,
        error: "Password must be atleast six characters long."
      });
      return false;
    }

    return true;
  };

  clickSubmit = e => {
    e.preventDefault();

    this.setState({
      loading: true
    });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({
            loading: false,
            error: data.error
          });
        } else {
          updateUser(data, () => {
            this.setState({
              loading: false,
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  render() {
    const {
      redirectToProfile,
      id,
      name,
      email,
      bio,
      password,
      error,
      loading
    } = this.state;

    const photoURL = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : avatar;

    if (redirectToProfile) return <Redirect to={`/user/${id}`} />;

    return (
      <div className="container">
        <h2 className="my-5" style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}>Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: !error && "none" }}
        >
          {error}
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <img
              src={photoURL}
              style={{ height: "25vh", width: "auto" }}
              className="img-thumbnail rounded-circle"
              onError={i => (i.target.src = `${avatar}`)}
              alt={name}
            />

            <form>
              <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input
                  onChange={this.handleChange}
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                  onChange={this.handleChange}
                  name="name"
                  type="text"
                  value={name}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                  onChange={this.handleChange}
                  name="email"
                  type="email"
                  value={email}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="text-muted">Bio</label>
                <textarea
                  onChange={this.handleChange}
                  name="bio"
                  type="text"
                  value={bio}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                  onChange={this.handleChange}
                  name="password"
                  type="password"
                  value={password}
                  className="form-control"
                />
              </div>
              <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
              >
                Update
              </button>
            </form>
          </>
        )}
      </div>
    );
  }
}
