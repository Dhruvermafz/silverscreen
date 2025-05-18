import React, { useState } from "react";

const ProfileSettings = ({
  userData,
  handleEditProfile,
  fileList,
  setFileList,
}) => {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    name: userData?.name || "",
    oldpass: "",
    newpass: "",
    confirmpass: "",
    select: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileList([{ uid: file.name, url: URL.createObjectURL(file) }]);
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    handleEditProfile(formData);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (formData.newpass === formData.confirmpass) {
      handleEditProfile({
        oldpass: formData.oldpass,
        newpass: formData.newpass,
      });
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div
      className="tab-pane fade"
      id="tab-4"
      role="tabpanel"
      aria-labelledby="4-tab"
      tabIndex="0"
    >
      <div className="row">
        <div className="col-12 col-lg-6">
          <form
            className="sign__form sign__form--full"
            onSubmit={handleSubmitProfile}
          >
            <div className="row">
              <div className="col-12">
                <h4 className="sign__title">Profile details</h4>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    className="sign__input"
                    placeholder="User 123"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    className="sign__input"
                    placeholder="email@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="fname">
                    Name
                  </label>
                  <input
                    id="fname"
                    type="text"
                    name="fname"
                    className="sign__input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="sign__gallery-upload">
                    Avatar
                  </label>
                  <div className="sign__gallery">
                    <label htmlFor="sign__gallery-upload">Upload (40x40)</label>
                    <input
                      id="sign__gallery-upload"
                      name="gallery"
                      className="sign__gallery-upload"
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button className="sign__btn sign__btn--small" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-12 col-lg-6">
          <form
            className="sign__form sign__form--full"
            onSubmit={handleSubmitPassword}
          >
            <div className="row">
              <div className="col-12">
                <h4 className="sign__title">Change password</h4>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="oldpass">
                    Old password
                  </label>
                  <input
                    id="oldpass"
                    type="password"
                    name="oldpass"
                    className="sign__input"
                    value={formData.oldpass}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="newpass">
                    New password
                  </label>
                  <input
                    id="newpass"
                    type="password"
                    name="newpass"
                    className="sign__input"
                    value={formData.newpass}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="confirmpass">
                    Confirm new password
                  </label>
                  <input
                    id="confirmpass"
                    type="password"
                    name="confirmpass"
                    className="sign__input"
                    value={formData.confirmpass}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                <div className="sign__group">
                  <label className="sign__label" htmlFor="select">
                    Select
                  </label>
                  <select
                    name="select"
                    id="select"
                    className="sign__select"
                    value={formData.select}
                    onChange={handleChange}
                  >
                    <option value="0">Option</option>
                    <option value="1">Option 2</option>
                    <option value="2">Option 3</option>
                    <option value="3">Option 4</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <button className="sign__btn sign__btn--small" type="submit">
                  Change
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
