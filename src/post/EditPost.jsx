import React, { Component } from "react";
import { singlePost, update } from "./postapi";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import Spinner from "../core/Spinner";
import defaultPost from "../images/italy.jpg";

export default class EditPost extends Component {
  state = {
    id: "",
    title: "",
    body: "",
    redirectToProfile: false,
    error: "",
    fileSize: 0,
    loading: false
  };

  init = postId => {
    this.setState({
      loading: true
    });

    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true, loading: false });
      } else {
        this.setState({
          loading: false,
          id: data._id,
          title: data.title,
          body: data.body,
          error: ""
        });
      }
    });
  };

  clickSubmit = e => {
    e.preventDefault();

    this.setState({
      loading: true
    });

    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then(data => {
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

  componentDidMount() {
    this.postData = new FormData();

    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  render() {
    const { id, title, body, redirectToProfile, error, loading } = this.state;
    if (redirectToProfile)
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;

    return (
      <div className="container">
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
            <h2
              className="my-5"
              style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
            >
              {title}
            </h2>
            <img
              src={`${
                process.env.REACT_APP_API_URL
              }/post/photo/${id}?${new Date().getTime()}`}
              className="img-thumbnail mb-3"
              style={{ height: "400px", width: "100%", objectFit: "cover" }}
              onError={i => (i.target.src = `${defaultPost}`)}
              alt={title}
            />
            <form>
              <div className="form-group">
                <label className="text-muted">Post Photo</label>
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
                <input
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
                Update Post
              </button>
            </form>
          </>
        )}
      </div>
    );
  }
}
