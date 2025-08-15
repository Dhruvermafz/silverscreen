import React, { useState } from "react";
import { message } from "antd";
import { useCreateContactMutation } from "../../actions/contactApi";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [messageText, setMessageText] = useState("");

  const [createContact, { isLoading, error }] = useCreateContactMutation();

  const onFinish = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!name) {
      message.error("Please enter your name!");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error("Please enter a valid email!");
      return;
    }
    if (!telephone) {
      message.error("Please enter your phone number!");
      return;
    }
    if (!messageText) {
      message.error("Please enter your message!");
      return;
    }

    try {
      await createContact({
        name,
        email,
        telephone,
        message: messageText,
      }).unwrap();
      message.success({
        content: "Your message has been sent successfully!",
        duration: 2,
      });
      // Reset form fields
      setName("");
      setEmail("");
      setTelephone("");
      setMessageText("");
    } catch (err) {
      message.error({
        content:
          err?.data?.message || "Failed to send message. Please try again.",
        duration: 2,
      });
    }
  };

  return (
    <section className="mn-contact p-b-15">
      <div className="mn-title d-none">
        <h2>
          Get in <span>Touch</span>
        </h2>
        <p>
          Please select a topic below related to your inquiry. If you don't find
          what you need, fill out our contact form.
        </p>
      </div>
      <div className="row p-t-80">
        <div className="col-md-6 mn-contact-detail m-b-m-30">
          <div className="mn-box m-b-30">
            <div className="detail">
              <div className="icon">
                <i className="ri-mail-send-line"></i>
              </div>
              <div className="info">
                <h3 className="title">Contact Email</h3>
                <p>contact@dimecine.com</p>
              </div>
            </div>
          </div>
          <div className="mn-box m-b-30">
            <div className="detail">
              <div className="icon">
                <i className="ri-customer-service-2-line"></i>
              </div>
              <div className="info">
                <h3 className="title">Contact Phone</h3>
                <p>(+1) 123-456-7890</p>
              </div>
            </div>
          </div>
          <div className="mn-box m-b-30">
            <div className="detail">
              <div className="icon">
                <i className="ri-map-pin-line"></i>
              </div>
              <div className="info">
                <h3 className="title">Address</h3>
                <p>205 North Michigan Avenue, Suite 810, Chicago, 60601, USA</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 m-t-767">
          <form onSubmit={onFinish}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Full Name"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Phone *"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                aria-label="Phone"
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                id="message"
                rows="5"
                placeholder="Message *"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
                aria-label="Message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="mn-btn-2"
              disabled={isLoading}
              aria-label="Submit contact form"
            >
              <span>{isLoading ? "Sending..." : "Submit"}</span>
            </button>
            {error && (
              <p className="mn-text-danger mt-3">
                {error?.data?.message || "An error occurred"}
              </p>
            )}
          </form>
        </div>
      </div>
      {/* Map Placeholder */}
      <section className="mn-map d-none d-md-block">
        <div className="border-radius-15 overflow-hidden">
          <div id="map-panes" className="leaflet-map"></div>
        </div>
      </section>
    </section>
  );
};

export default Contact;
