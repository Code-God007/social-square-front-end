import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import DeleteUser from "./DeleteUser";
import avatar from "../images/avatar.png";
import { read } from "./userapi";
import FollowProfile from "./FollowProfile";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/postapi";
import defaultPost from "../images/italy.jpg";

export default class Profile extends Component {
  state = {
    user: {
      following: [],
      followers: []
    },
    redirectToSignin: false,
    following: false,
    posts: []
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  clickFollow = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    callApi(userId, token, this.state.user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });

        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          posts: data
        });
      }
    });
  };

  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  render() {
    const { redirectToSignin, user, posts } = this.state;
    const photoURL = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : avatar;

    if (redirectToSignin) return <Redirect to="/signin" />;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col mx-5">
            <h2
              className="my-5 shadow-sm p-3 bg-white rounded"
              style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
            >
              Profile Page{" "}
            </h2>
            <img
              src={photoURL}
              style={{ height: "300px", width: "300px" }}
              className="img-thumbnail rounded-circle"
              onError={i => (i.target.src = `${avatar}`)}
              alt={user.name}
            />

            <div className="col">
              <div className="lead mt-2">
                <div className="d-flex mb-2">
                  <p>Hello {user.name}</p>
                  <ProfileTabs
                    followers={user.followers}
                    following={user.following}
                  />
                </div>
                <p>Email: {user.email}</p>
                <p>{`Joined: ${new Date(user.created).toDateString()}`}</p>
              </div>
              {isAuthenticated().user &&
              isAuthenticated().user._id === user._id ? (
                <div className="d-inline-block">
                  <Link
                    to="/create/post"
                    className="btn btn-raised btn-info mr-5"
                  >
                    Create Post
                  </Link>
                  <Link
                    className="btn btn-raised btn-success mr-5"
                    to={`/user/edit/${user._id}`}
                  >
                    Edit Profile
                  </Link>
                  <DeleteUser userId={user._id} />
                </div>
              ) : (
                <FollowProfile
                  following={this.state.following}
                  onButtonClick={this.clickFollow}
                />
              )}
              <hr />
            </div>

            <div className="col">
              <h2
                className="shadow-sm p-3 mb-5 bg-white rounded"
                style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
              >
                Bio
              </h2>
              <hr />
              <p className="text-center" style={{ fontSize: "1.8rem" }}>
                {user.bio}
              </p>
              <hr />
            </div>
          </div>
          <div className="col mx-5">
            <h2
              className="my-5 shadow-sm p-3 bg-white rounded"
              style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
            >
              Your Posts
            </h2>
            {posts.map((post, id) => (
              <div className="card shadow p-3 mb-5 bg-white rounded" key={id}>
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
                    Posted on {new Date(post.created).toDateString()}
                  </p>
                  <Link to={`/post/${post._id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
