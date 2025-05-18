import React from "react";

const Discover = () => {
  return (
    <section class="content">
      <div class="content__head content__head--mt">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h2 class="content__title">Discover</h2>

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
                    Filmography
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
                    Photos
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-12">
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

                <div class="row">
                  <div class="col-12">
                    <div class="paginator-mob">
                      <span class="paginator-mob__pages">18 of 1713</span>

                      <ul class="paginator-mob__nav">
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
                    </div>

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
                        <a href="#">87</a>
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

              <div
                class="tab-pane fade"
                id="tab-2"
                role="tabpanel"
                aria-labelledby="2-tab"
                tabindex="0"
              >
                <div class="gallery gallery--full" itemscope>
                  <div class="row">
                    <figure
                      class="col-12 col-sm-6 col-xl-4"
                      itemprop="associatedMedia"
                      itemscope
                    >
                      <a
                        href="img/gallery/project-1.jpg"
                        itemprop="contentUrl"
                        data-size="1920x1280"
                      >
                        <img
                          src="img/gallery/project-1.jpg"
                          itemprop="thumbnail"
                          alt="Image description"
                        />
                      </a>
                      <figcaption itemprop="caption description">
                        Some image caption 1
                      </figcaption>
                    </figure>

                    <figure
                      class="col-12 col-sm-6 col-xl-4"
                      itemprop="associatedMedia"
                      itemscope
                    >
                      <a
                        href="img/gallery/project-2.jpg"
                        itemprop="contentUrl"
                        data-size="1920x1280"
                      >
                        <img
                          src="img/gallery/project-2.jpg"
                          itemprop="thumbnail"
                          alt="Image description"
                        />
                      </a>
                      <figcaption itemprop="caption description">
                        Some image caption 2
                      </figcaption>
                    </figure>

                    <figure
                      class="col-12 col-sm-6 col-xl-4"
                      itemprop="associatedMedia"
                      itemscope
                    >
                      <a
                        href="img/gallery/project-3.jpg"
                        itemprop="contentUrl"
                        data-size="1920x1280"
                      >
                        <img
                          src="img/gallery/project-3.jpg"
                          itemprop="thumbnail"
                          alt="Image description"
                        />
                      </a>
                      <figcaption itemprop="caption description">
                        Some image caption 3
                      </figcaption>
                    </figure>

                    <figure
                      class="col-12 col-sm-6 col-xl-4"
                      itemprop="associatedMedia"
                      itemscope
                    >
                      <a
                        href="img/gallery/project-4.jpg"
                        itemprop="contentUrl"
                        data-size="1920x1280"
                      >
                        <img
                          src="img/gallery/project-4.jpg"
                          itemprop="thumbnail"
                          alt="Image description"
                        />
                      </a>
                      <figcaption itemprop="caption description">
                        Some image caption 4
                      </figcaption>
                    </figure>

                    <figure
                      class="col-12 col-sm-6 col-xl-4"
                      itemprop="associatedMedia"
                      itemscope
                    >
                      <a
                        href="img/gallery/project-5.jpg"
                        itemprop="contentUrl"
                        data-size="1920x1280"
                      >
                        <img
                          src="img/gallery/project-5.jpg"
                          itemprop="thumbnail"
                          alt="Image description"
                        />
                      </a>
                      <figcaption itemprop="caption description">
                        Some image caption 5
                      </figcaption>
                    </figure>

                    <figure
                      class="col-12 col-sm-6 col-xl-4"
                      itemprop="associatedMedia"
                      itemscope
                    >
                      <a
                        href="img/gallery/project-6.jpg"
                        itemprop="contentUrl"
                        data-size="1920x1280"
                      >
                        <img
                          src="img/gallery/project-6.jpg"
                          itemprop="thumbnail"
                          alt="Image description"
                        />
                      </a>
                      <figcaption itemprop="caption description">
                        Some image caption 6
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discover;
