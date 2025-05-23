import React from "react";

const ForgotPassword = () => {
  return (
    <div class="sign section--bg" data-bg="img/bg/section__bg.jpg">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="sign__content">
              <form action="#" class="sign__form">
                <a href="index.html" class="sign__logo">
                  <img src="img/logo.svg" alt="" />
                </a>

                <div class="sign__group">
                  <input type="text" class="sign__input" placeholder="Email" />
                </div>

                <div class="sign__group sign__group--checkbox">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked="checked"
                  />
                  <label for="remember">
                    I agree to the <a href="privacy.html">Privacy Policy</a>
                  </label>
                </div>

                <button class="sign__btn" type="button">
                  Send
                </button>

                <span class="sign__text">
                  We will send a password to your Email
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
