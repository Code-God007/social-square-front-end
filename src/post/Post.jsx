import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./postapi";
import defaultPost from "../images/italy.jpg";
import Spinner from "../core/Spinner";
import { Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import DeletePost from "./DeletePost";
import Comment from "./Comment";

export default class Post extends Component {
  state = {
    post: "",
    loading: false,
    deleted: false,
    redirectToHome: false,
    like: false,
    totalLikes: 0,
    comments: [],
    error: ""
  };

  checkLike = likes => {
    if (!isAuthenticated()) {
      this.setState({ error: "Please Sign In to Like and Comment" });
    } else {
      const userId = isAuthenticated().user._id;
      let match = likes.indexOf(userId) !== -1;
      return match;
    }
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.comments);
      } else {
        this.postedId = data.postedBy._id;
        this.setState({
          post: data,
          totalLikes: data.likes.length,
          loading: false,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };

  updateComments = comments => {
    this.setState({ comments });
  };

  likeToggle = () => {
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          totalLikes: data.likes.length
        });
      }
    });
  };

  deleteConfirmed = () => {
    this.setState({ loading: true });
    const token = isAuthenticated().token;
    const postId = this.props.match.params.postId;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          deleted: true,
          loading: false,
          redirectToHome: true
        });
      }
    });
  };

  render() {
    const {
      post,
      redirectToHome,
      totalLikes,
      like,
      comments,
      error
    } = this.state;
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Anonymous";
    if (this.state.loading) {
      return <Spinner />;
    }

    if (redirectToHome) return <Redirect to="/" />;
    return (
      <div className="container">
        <div
          className="alert alert-danger mt-5"
          style={{ display: !error && "none" }}
        >
          {error}
        </div>
        <h2
          className="my-5"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
        >
          {post.title}
        </h2>
        <div className="card-body">
          <img
            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
            alt={post.title}
            onError={i => (i.target.src = `${defaultPost}`)}
            className="img-thumbnail mb-3"
            style={{ height: "400px", width: "100%", objectFit: "cover" }}
          />
          {like ? (
            <h4>
              {totalLikes} Like{" "}
              {isAuthenticated() && (
                <i
                  style={{ cursor: "pointer" }}
                  onClick={this.likeToggle}
                  className="far fa-thumbs-up text-success"
                ></i>
              )}
            </h4>
          ) : (
            <h4>
              {totalLikes} Like{" "}
              {isAuthenticated() && (
                <i
                  style={{ cursor: "pointer" }}
                  onClick={this.likeToggle}
                  className="far fa-thumbs-up text-warning"
                ></i>
              )}
            </h4>
          )}
          <p className="card-text">{post.body}</p>
          <br />
          <p className="font-italic mark">
            Posted by <Link to={`${posterId}`}>{posterName}</Link> on{" "}
            {new Date(post.created).toDateString()}
          </p>
          <div className="d-inline-block">
            <Link to={`/`} className="btn btn-primary">
              Back To Posts
            </Link>
            {isAuthenticated().user &&
              isAuthenticated().user._id === this.postedId && (
                <>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-warning mx-5"
                  >
                    Update Post
                  </Link>
                  <DeletePost deleteConfirmed={this.deleteConfirmed} />
                </>
              )}
          </div>
        </div>
        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}
