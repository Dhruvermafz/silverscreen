import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import { FiStar } from "react-icons/fi";

const ProfileTab = ({
  userData,
  profileForm,
  setProfileForm,
  fileList,
  setFileList,
  handleUpdateProfile,
  handleUploadAvatar,
  handleRatingChange,
}) => {
  return (
    <>
      <Card className="text-center mb-4">
        <Card.Body>
          <img
            src={userData.avatar || "https://via.placeholder.com/100"}
            alt="Avatar"
            className="rounded-circle mb-3"
            style={{ width: "100px", height: "100px" }}
          />
          <h3>{userData.username}</h3>
          <p>{userData.email}</p>
          <div>
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={
                  i < profileForm.rating ? "text-warning" : "text-muted"
                }
                onClick={() => handleRatingChange(i + 1)}
                style={{ cursor: "pointer", fontSize: "1.5rem" }}
              />
            ))}
          </div>
        </Card.Body>
      </Card>
      <form onSubmit={handleUpdateProfile}>
        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter your bio"
            value={profileForm.bio}
            onChange={(e) =>
              setProfileForm({ ...profileForm, bio: e.target.value })
            }
            maxLength={500}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleUploadAvatar}
          />
          {fileList.length > 0 && (
            <div className="mt-2">
              <img
                src={fileList[0].url}
                alt="Preview"
                style={{ width: "100px", height: "100px" }}
              />
              <Button
                variant="link"
                className="text-danger"
                onClick={() => setFileList([])}
              >
                Remove
              </Button>
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Favorite Movies</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter one movie per line"
            value={profileForm.favoriteMovies}
            onChange={(e) =>
              setProfileForm({ ...profileForm, favoriteMovies: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Favorite Genres</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter one genre per line"
            value={profileForm.favoriteGenres}
            onChange={(e) =>
              setProfileForm({ ...profileForm, favoriteGenres: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Twitter</Form.Label>
          <Form.Control
            type="text"
            placeholder="Twitter URL"
            value={profileForm.socialLinks.twitter}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                socialLinks: {
                  ...profileForm.socialLinks,
                  twitter: e.target.value,
                },
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Instagram</Form.Label>
          <Form.Control
            type="text"
            placeholder="Instagram URL"
            value={profileForm.socialLinks.instagram}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                socialLinks: {
                  ...profileForm.socialLinks,
                  instagram: e.target.value,
                },
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Profile Visibility</Form.Label>
          <Form.Check
            type="switch"
            label={profileForm.isPublic ? "Public" : "Private"}
            checked={profileForm.isPublic}
            onChange={(e) =>
              setProfileForm({ ...profileForm, isPublic: e.target.checked })
            }
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Update Profile
        </Button>
      </form>
    </>
  );
};

export default ProfileTab;
