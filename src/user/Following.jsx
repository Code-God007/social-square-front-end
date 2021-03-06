import React from "react";
import { Link } from "react-router-dom";
import avatar from "../images/avatar.png";

export class Following extends React.Component {
  render() {
    const { following } = this.props;
    return (
      <>
        <button
          type="button"
          className="btn btn-dark btn-sm mx-3 mb-3"
          data-toggle="modal"
          data-target="#exampleModal2"
        >
          Following
        </button>

        <div
          className="modal fade"
          id="exampleModal2"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-dark">
                <h5
                  className="modal-title"
                  id="exampleModalLabel"
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "2.8rem"
                  }}
                >
                  Following
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {following.map((person, i) => (
                  <div key={i}>
                    <div className="row">
                      <Link to={`/user/${person._id}`}>
                        <img
                          style={{
                            height: "100px",
                            width: "100px"
                          }}
                          className="img-thumbnail rounded-circle mt-3 ml-4"
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                          alt={person.name}
                          onError={i => (i.target.src = `${avatar}`)}
                        />
                        <p
                          className="ml-3 text-dark lead float-right"
                          style={{ fontSize: "2.2rem", marginTop: "2rem" }}
                        >
                          {person.name}
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Following;
