import React, { useState } from "react";
import { useCreateContactMutation } from "../../actions/contactApi";
const Contact = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    subject: "",
    message: "",
  });

  const [createContact, { isLoading, isSuccess, isError, error }] =
    useCreateContactMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact(formData).unwrap();
      setFormData({ firstname: "", email: "", subject: "", message: "" });
      alert("Message sent successfully!");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-12 col-xl-8">
            <div className="row">
              <div className="col-12">
                <h2 className="section__title">Contact Form</h2>
              </div>

              <div className="col-12">
                <form
                  onSubmit={handleSubmit}
                  className="sign__form sign__form--full"
                >
                  <div className="row">
                    <div className="col-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="firstname">
                          Name
                        </label>
                        <input
                          id="firstname"
                          type="text"
                          name="firstname"
                          className="sign__input"
                          placeholder="John"
                          value={formData.firstname}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email" // Changed to type="email" for validation
                          name="email"
                          className="sign__input"
                          placeholder="email@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="subject">
                          Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          name="subject"
                          className="sign__input"
                          placeholder="Partnership"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="message">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          className="sign__textarea"
                          placeholder="Type your message..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit" // Changed to type="submit" for form submission
                        className="sign__btn sign__btn--small"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send"}
                      </button>
                      {isSuccess && (
                        <p className="success">Message sent successfully!</p>
                      )}
                      {isError && (
                        <p className="error">
                          Error:{" "}
                          {error?.data?.message || "Failed to send message"}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <div className="row">
              <div className="col-12">
                <h2 className="section__title section__title--mt">
                  Get In Touch
                </h2>
                <p className="section__text">
                  We are always happy to help and provide more information about
                  our services. You can contact us through email, phone, or by
                  filling out the form on our website. Thank you for considering
                  us!
                </p>
                <ul className="contacts__list">
                  <li>
                    <a href="tel:+18002345678">+1 800 234 56 78</a>
                  </li>
                  <li>
                    <a href="mailto:support@hotflix.com">
                      support@hotflix.template
                    </a>
                  </li>
                </ul>
                <div className="contacts__social">
                  <a href="#">
                    <i className="ti ti-brand-facebook"></i>
                  </a>
                  <a href="#">
                    <i className="ti ti-brand-x"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/volkov_des1gn/"
                    target="_blank"
                  >
                    <i className="ti ti-brand-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="ti ti-brand-discord"></i>
                  </a>
                  <a href="#">
                    <i className="ti ti-brand-telegram"></i>
                  </a>
                  <a href="#">
                    <i className="ti ti-brand-tiktok"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
