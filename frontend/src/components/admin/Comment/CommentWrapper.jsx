import React from "react";

const CommentWrapper = () => {
  return (
    <main class="main">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="main__title">
              <h2>Catalog</h2>

              <span class="main__title-stat">14,452 Total</span>

              <div class="main__title-wrap">
                <a
                  href="add-item.html"
                  class="main__title-link main__title-link--wrap"
                >
                  Add item
                </a>

                <select class="filter__select" name="sort" id="filter__sort">
                  <option value="0">Date created</option>
                  <option value="1">Rating</option>
                  <option value="2">Views</option>
                </select>

                <form action="#" class="main__title-form">
                  <input type="text" placeholder="Find movie / tv series.." />
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
                    <th>TITLE</th>
                    <th>RATING</th>
                    <th>CATEGORY</th>
                    <th>VIEWS</th>
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
                      <div class="catalog__text">
                        <a href="#">I Dream in Another Language</a>
                      </div>
                    </td>
                    <td>
                      <div class="catalog__text catalog__text--rate">7.9</div>
                    </td>
                    <td>
                      <div class="catalog__text">Movie</div>
                    </td>
                    <td>
                      <div class="catalog__text">1392</div>
                    </td>
                    <td>
                      <div class="catalog__text catalog__text--green">
                        Visible
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
                        <a href="#" class="catalog__btn catalog__btn--view">
                          <i class="ti ti-eye"></i>
                        </a>
                        <a
                          href="add-item.html"
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

export default CommentWrapper;
