import React from "react";

const Error404 = () => {
  return (
    <div class="page-404 section--bg" data-bg="img/bg/section__bg.jpg">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="page-404__wrap">
              <div class="page-404__content">
                <h1 class="page-404__title">404</h1>
                <p class="page-404__text">
                  The page you are looking for <br />
                  not available!
                </p>
                <a href="index.html" class="page-404__btn">
                  go back
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
