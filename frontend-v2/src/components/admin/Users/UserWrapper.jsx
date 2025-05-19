import React from "react";

const UserWrapper = () => {
  return (
    <main class="main">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="main__title">
              <h2>Users</h2>

              <span class="main__title-stat">3,702 Total</span>

              <div class="main__title-wrap">
                <button
                  type="button"
                  data-bs-toggle="modal"
                  class="main__title-link main__title-link--wrap"
                  data-bs-target="#modal-user"
                >
                  Add user
                </button>

                <select class="filter__select" name="sort" id="filter__sort">
                  <option value="0">Date created</option>
                  <option value="1">Pricing plan</option>
                  <option value="2">Status</option>
                </select>

                <form action="#" class="main__title-form">
                  <input type="text" placeholder="Find user.." />
                  <button type="button">
                    <i class="ti ti-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="catalog catalog--1">
              <table class="catalog__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>BASIC INFO</th>
                    <th>USERNAME</th>
                    <th>PRICING PLAN</th>
                    <th>COMMENTS</th>
                    <th>REVIEWS</th>
                    <th>STATUS</th>
                    <th>CRAETED DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <div class="catalog__text">11</div>
                    </td>
                    <td>
                      <div class="catalog__user">
                        <div class="catalog__avatar">
                          <img src="img/user.svg" alt="" />
                        </div>
                        <div class="catalog__meta">
                          <h3>Tess Harper</h3>
                          <span>email@email.com</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="catalog__text">Username</div>
                    </td>
                    <td>
                      <div class="catalog__text">Premium</div>
                    </td>
                    <td>
                      <div class="catalog__text">13</div>
                    </td>
                    <td>
                      <div class="catalog__text">1</div>
                    </td>
                    <td>
                      <div class="catalog__text catalog__text--green">
                        Approved
                      </div>
                    </td>
                    <td>
                      <div class="catalog__text">05.02.2023</div>
                    </td>
                    <td>
                      <div class="catalog__btns">
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          class="catalog__btn catalog__btn--banned"
                          data-bs-target="#modal-status"
                        >
                          <i class="ti ti-lock"></i>
                        </button>
                        <a
                          href="edit-user.html"
                          class="catalog__btn catalog__btn--edit"
                        >
                          <i class="ti ti-edit"></i>
                        </a>
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          class="catalog__btn catalog__btn--delete"
                          data-bs-target="#modal-delete"
                        >
                          <i class="ti ti-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="col-12">
            <div class="main__paginator">
              <span class="main__paginator-pages">10 of 169</span>

              <ul class="main__paginator-list">
                <li>
                  <a href="#">
                    <i class="ti ti-chevron-left"></i>
                    <span>Prev</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span>Next</span>
                    <i class="ti ti-chevron-right"></i>
                  </a>
                </li>
              </ul>

              <ul class="paginator">
                <li class="paginator__item paginator__item--prev">
                  <a href="#">
                    <i class="ti ti-chevron-left"></i>
                  </a>
                </li>
                <li class="paginator__item">
                  <a href="#">1</a>
                </li>
                <li class="paginator__item paginator__item--active">
                  <a href="#">2</a>
                </li>
                <li class="paginator__item">
                  <a href="#">3</a>
                </li>
                <li class="paginator__item">
                  <a href="#">4</a>
                </li>
                <li class="paginator__item">
                  <span>...</span>
                </li>
                <li class="paginator__item">
                  <a href="#">29</a>
                </li>
                <li class="paginator__item">
                  <a href="#">30</a>
                </li>
                <li class="paginator__item paginator__item--next">
                  <a href="#">
                    <i class="ti ti-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserWrapper;
