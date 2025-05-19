import React from "react";

const DeleteUserModal = () => {
  return (
    <div
      class="modal fade"
      id="modal-delete"
      tabindex="-1"
      aria-labelledby="modal-delete"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal__content">
            <form action="#" class="modal__form">
              <h4 class="modal__title">User delete</h4>

              <p class="modal__text">
                Are you sure to permanently delete this user?
              </p>

              <div class="modal__btns">
                <button class="modal__btn modal__btn--apply" type="button">
                  <span>Delete</span>
                </button>
                <button
                  class="modal__btn modal__btn--dismiss"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span>Dismiss</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
