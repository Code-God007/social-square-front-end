import React, { Component } from "react";

export default class DeleteComment extends Component {
  render() {
    return (
      <>
        <button
          type="button"
          className="btn btn-danger"
          data-toggle="modal"
          data-target="#exampleModal9"
        >
          Remove
        </button>

        <div
          className="modal fade"
          id="exampleModal9"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Confirmation
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
                Do you want to delete this Comment?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={() => this.props.deleteConfirmed(this.props.comment)}
                >
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
