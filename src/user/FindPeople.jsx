import React, { Component } from "react";
import { findPeople, follow } from "./userapi";
import avatar from "../images/avatar.png";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Spinner from "../core/Spinner";

export default class FindPeople extends Component {
  state = {
    users: [],
    error: "",
    open: false,
    followMsg: "",
    loading: false
  };

  componentDidMount() {
    this.setState({ loading: true });
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
        this.setState({ loading: false });
      } else {
        this.setState({ users: data, loading: false });
      }
    });
  }

  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    follow(userId, token, user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMsg: `Following ${user.name}`
        });
      }
    });
  };

  render() {
    const { users, open, followMsg } = this.state;

    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <div className="container">
        <div className="jumbotron">
          <h2
            className="my-5"
            style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
          >
            People You May Know
          </h2>

          {open && (
            <div className="alert alert-success">
              <p>{followMsg}</p>
            </div>
          )}

          <div className="row mx-4">
            {users.map((user, id) => (
              <div
                className="card col-md-6 shadow p-3 mb-5 bg-white rounded"
                key={id}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${
                    user._id
                  }?${new Date().getTime()}`}
                  style={{ height: "400px", width: "auto" }}
                  className="img-thumbnail"
                  onError={i => (i.target.src = `${avatar}`)}
                  alt={user.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">{user.bio}</p>
                  <Link
                    to={`user/${user._id}`}
                    className="btn btn-raised btn-primary"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => this.clickFollow(user, id)}
                    className="btn btn-raised btn-success float-right mr-5"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
