import React from "react";

const RecentlyUploaded = () => {
  return (
    <section class="content">
      <div class="content__head">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h2 class="content__title">Recently updated</h2>

              <ul
                class="nav nav-tabs content__tabs"
                id="content__tabs"
                role="tablist"
              >
                <li class="nav-item" role="presentation">
                  <button
                    id="1-tab"
                    class="active"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-1"
                    type="button"
                    role="tab"
                    aria-controls="tab-1"
                    aria-selected="true"
                  >
                    New items
                  </button>
                </li>

                <li class="nav-item" role="presentation">
                  <button
                    id="2-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-2"
                    type="button"
                    role="tab"
                    aria-controls="tab-2"
                    aria-selected="false"
                  >
                    Movies
                  </button>
                </li>

                <li class="nav-item" role="presentation">
                  <button
                    id="3-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-3"
                    type="button"
                    role="tab"
                    aria-controls="tab-3"
                    aria-selected="false"
                  >
                    TV Shows
                  </button>
                </li>

                <li class="nav-item" role="presentation">
                  <button
                    id="4-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#tab-4"
                    type="button"
                    role="tab"
                    aria-controls="tab-4"
                    aria-selected="false"
                  >
                    Anime
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="tab-content">
          <div
            class="tab-pane fade show active"
            id="tab-1"
            role="tabpanel"
            aria-labelledby="1-tab"
            tabindex="0"
          >
            <div class="row">
              <div class="col-6 col-sm-4 col-lg-3 col-xl-2">
                <div class="item">
                  <div class="item__cover">
                    <img src="img/covers/cover.jpg" alt="" />
                    <a href="details.html" class="item__play">
                      <i class="ti ti-player-play-filled"></i>
                    </a>
                    <span class="item__rate item__rate--green">8.4</span>
                    <button class="item__favorite" type="button">
                      <i class="ti ti-bookmark"></i>
                    </button>
                  </div>
                  <div class="item__content">
                    <h3 class="item__title">
                      <a href="details.html">I Dream in Another Language</a>
                    </h3>
                    <span class="item__category">
                      <a href="#">Action</a>
                      <a href="#">Triler</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <a class="section__more" href="catalog.html">
              View all
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyUploaded;
