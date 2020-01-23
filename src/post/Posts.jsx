import React, { Component } from "react";
import { list } from "./postapi";
import defaultPost from "../images/italy.jpg";
import { Link } from "react-router-dom";

export default class Posts extends Component {
  state = {
    posts: [],
    page: 1
  };

  loadPosts = page => {
    list(page).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  loadMore = number => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = number => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  render() {
    const { posts, page } = this.state;

    return (
      <div className="jumbotron">
        <h2
          className="my-2 mx-4"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
        >
          {!posts.length ? "No more posts!" : "Your Timeline"}
        </h2>
        <div className="row mx-4">
          {posts.map((post, id) => {
            const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
            const posterName = post.postedBy
              ? post.postedBy.name
              : " Anonymous";
            return (
              <div
                className="card col-md-6 shadow p-3 mb-5 bg-white rounded"
                key={id}
              >
                <div className="card-body">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={i => (i.target.src = `${defaultPost}`)}
                    className="img-thumbnail mb-3"
                    style={{ height: "400px", width: "100%" }}
                  />
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body.substring(0, 100)}</p>
                  <br />
                  <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName}</Link> on{" "}
                    {new Date(post.created).toDateString()}
                  </p>
                  <Link to={`post/${post._id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning mr-5 ml-3 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}

        {posts.length ? (
          <button
            className="btn btn-raised btn-success mt-5 mb-5 ml-3"
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}
