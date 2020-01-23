import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "../core/Spinner";
import { isAuthenticated } from "../auth";
import { create } from "./postapi";

export default class NewPost extends Component {
  state = {
    title: "",
    body: "",
    photo: "",
    error: "",
    user: {},
    fileSize: 0,
    loading: false,
    redirectToProfile: false
  };

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  handleChange = e => {
    this.setState({ error: "" });
    const value =
      e.target.name === "photo" ? e.target.files[0] : e.target.value;
    const fileSize = e.target.name === "photo" ? e.target.files[0].size : 0;
    this.postData.set(e.target.name, value);
    this.setState({
      [e.target.name]: value,
      fileSize
    });
  };

  //   Client Side Validation
  isValid = () => {
    const { title, body, fileSize } = this.state;

    if (fileSize > 2500000) {
      this.setState({
        loading: false,
        error: "File size should be less than 2.5 mb"
      });
      return false;
    }

    if (title.length === 0 || body.length === 0) {
      this.setState({
        loading: false,
        error: "All Fields are required"
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
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({
            loading: false,
            error: data.error
          });
        } else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirectToProfile: true
          });
        }
      });
    }
  };

  render() {
    const { title, body, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) return <Redirect to={`/`} />;
    return (
      <div className="container">
        <h2
          className="my-5"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
        >
          Create Post
        </h2>
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
            <form>
              <div className="form-group">
                <label className="text-muted">Photo</label>
                <input
                  onChange={this.handleChange}
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                  onChange={this.handleChange}
                  name="title"
                  type="text"
                  value={title}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                  onChange={this.handleChange}
                  name="body"
                  type="text"
                  value={body}
                  className="form-control"
                />
              </div>
              <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
              >
                Create Post
              </button>
            </form>
          </>
        )}
      </div>
    );
  }
}
