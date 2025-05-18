import React from "react";

const ActorDetails = () => {
  return (
    <section class="section section--details">
      <div class="section__details-bg" data-bg="img/bg/actor__bg.jpg"></div>

      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1 class="section__title section__title--head">
              Michelle Rodriguez
            </h1>
          </div>

          <div class="col-12 col-lg-9 col-xl-6">
            <div class="item item--details">
              <div class="row">
                <div class="col-12 col-sm-5 col-md-5">
                  <div class="item__cover">
                    <img src="img/covers/actor.jpg" alt="" />
                  </div>
                </div>

                <div class="col-12 col-md-7">
                  <div class="item__content">
                    <ul class="item__meta">
                      <li>
                        <span>Career:</span> Actress
                      </li>
                      <li>
                        <span>Height:</span> 1.65 m
                      </li>
                      <li>
                        <span>Date of birth:</span> July 12, 1978
                      </li>
                      <li>
                        <span>Place of birth:</span> San Antonio, Texas, United
                        States
                      </li>
                      <li>
                        <span>Age:</span> 44
                      </li>
                      <li>
                        <span>Zodiac:</span> Cancer
                      </li>
                      <li>
                        <span>Genres:</span> <a href="#">Action</a>{" "}
                        <a href="#">Triler</a> <a href="#">Drama</a>
                      </li>
                      <li>
                        <span>Total number of movies:</span> 109
                      </li>
                      <li>
                        <span>First movie:</span>{" "}
                        <a href="details.html">Girl Fight (2000)</a>
                      </li>
                      <li>
                        <span>Last movie:</span>{" "}
                        <a href="details.html">
                          Fast and the Furious 10 (2023)
                        </a>
                      </li>
                      <li>
                        <span>Best movie:</span>{" "}
                        <a href="details.html">Avatar</a>
                      </li>
                    </ul>
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

export default ActorDetails;
