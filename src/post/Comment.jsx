import React, { Component } from "react";
import { comment, uncomment } from "./postapi";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import avatar from "../images/avatar.png";
import DeleteComment from "./DeleteComment";

export default class Comment extends Component {
  state = {
    text: "",
    error: ""
  };

  handleChange = e => {
    this.setState({ error: "", text: e.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Comment should not be empty or greater than 150 characters"
      });
      return false;
    }
    return true;
  };

  deleteConfirmed = comment => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // dispatch fresh list of comments to Post to display
        this.props.updateComments(data.comments);
      }
    });
  };

  addComment = e => {
    e.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: "Please Sign In to leave a comment" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // dispatch fresh list of comments to Post to display
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  render() {
    const { comments } = this.props;
    return (
      <div>
        <h2
          className="my-5"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "2.8rem" }}
        >
          Leave a Comment
        </h2>
        <div
          className="alert alert-danger"
          style={{ display: !this.state.error && "none" }}
        >
          {this.state.error}
        </div>
        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              placeholder="Your Comment"
              onChange={this.handleChange}
              value={this.state.text}
              type="text"
              className="form-control"
            />
            <button className="btn btn-raised btn-success mt-2">Post</button>
          </div>
        </form>
        <div className="col-md-12 mt-4">
          <h3
            className="text-primary"
            style={{ fontFamily: "'Bangers', cursive", fontSize: "2rem" }}
          >
            {comments.length} Comments
          </h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <div className="shadow-lg p-3 mb-5 bg-white rounded">
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{
                      height: "60px",
                      width: "60px"
                    }}
                    className="img-thumbnail rounded-circle float-left mr-4"
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    alt={comment.postedBy.name}
                    onError={i => (i.target.src = `${avatar}`)}
                  />
                </Link>
                <div>
                  <p
                    className="text-dark lead"
                    style={{ fontSize: "1.8rem", marginTop: "0.8rem" }}
                  >
                    {comment.text}
                  </p>
                  <p className="font-italic mark">
                    Posted by{" "}
                    <Link to={`/user/${comment.postedBy._id}`}>
                      {comment.postedBy.name}
                    </Link>{" "}
                    on {new Date(comment.created).toDateString()}
                  </p>
                  {isAuthenticated().user &&
                    isAuthenticated().user._id === comment.postedBy._id && (
                      <DeleteComment
                        deleteConfirmed={this.deleteConfirmed}
                        comment={comment}
                      />
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
