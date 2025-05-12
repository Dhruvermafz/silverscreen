Absolutely! Here's a breakdown of each **frontend page**, describing its **purpose**, **key components**, and **user interactions** based on your backend controller structure and permissions:

---

## 🔐 **1. Auth Pages**

### 1.1. **Login Page**

- **Purpose:** Allows users to log in to the platform.
- **Components:** Email/password form, social login buttons, forgot password link.
- **Actions:** Call `loginUser()`, store token, redirect to homepage or last visited page.

### 1.2. **Register Page**

- **Purpose:** For new user sign-ups.
- **Components:** Username, email, password, confirm password, role (optional).
- **Actions:** Call `registerUser()`, auto-login on success.

### 1.3. **Logout (Trigger)**

- **Functionality:** Clicking “Logout” will call `logoutUser()` and clear all user data.

---

## 👤 **2. User Pages**

### 2.1. **User Profile Page** (`/user/:userId`)

- **Purpose:** Displays a user's profile, including watchlist, favorites, diary, stats.
- **Sections:**
  - Bio, Profile Picture, Followers
  - Tabs: Watchlist, Favorites, Reviews, Diary, Stats
  - Follow/Unfollow button
- **Actions:**`getUserProfile()`, `getUserStats()`, `followUser()`, `unfollowUser()`

### 2.2. **Edit Profile Page** (`/settings/profile`)

- **Purpose:** Allows user to edit bio, avatar, links, etc.
- **Actions:**`updateUserProfile()`

---

## 🎥 **3. Film Pages**

### 3.1. **Film Detail Page** (`/film/:filmId`)

- **Purpose:** Shows detailed info about a movie.
- **Sections:**
  - Trailer, Poster, Overview
  - Cast & Crew, Streaming availability
  - Box office stats, Reviews, Tags
- **Actions:**`getFilmById()`, `getCastAndCrew()`, `getStreamingAvailability()`, `getBoxOfficeData()`

### 3.2. **Film Search Results Page** (`/search?q=`)

- **Purpose:** Show search results for user queries.
- **Actions:**`searchFilms(query)`

### 3.3. **Trending Films Page** (`/trending`)

- **Purpose:** Displays currently trending films.
- **Actions:**`getTrendingFilms()`

---

## 📝 **4. Review Pages**

### 4.1. **Write/Edit Review Page** (`/film/:filmId/review`, `/review/edit/:reviewId`)

- **Purpose:** Users can write or edit a review.
- **Components:** Star rating, spoiler toggle, text editor.
- **Actions:**`addReview()`, `editReview()`

### 4.2. **User Reviews Page** (`/user/:userId/reviews`)

- **Purpose:** Lists all reviews by a user.
- **Actions:**`getReviewsByUser(userId)`

### 4.3. **Film Reviews Page** (`/film/:filmId/reviews`)

- **Purpose:** Displays all reviews for a particular film.
- **Actions:**`getReviewsByFilm(filmId)`

---

## 📚 **5. List Pages**

### 5.1. **Create/Edit List Page** (`/lists/new`, `/lists/edit/:listId`)

- **Purpose:** Create a custom film list.
- **Components:** Title, description, film picker.
- **Actions:**`createList()`, `editList()`, `addFilmToList()`, `removeFilmFromList()`

### 5.2. **List Detail Page** (`/lists/:listId`)

- **Purpose:** View a curated list of films.
- **Actions:**`getListById()`

### 5.3. **User Lists Page** (`/user/:userId/lists`)

- **Purpose:** All lists by a user.
- **Actions:**`getListsByUser()`

### 5.4. **Featured Lists Page** (`/lists/featured`)

- **Purpose:** Admin/mod curated spotlighted lists.
- **Actions:**`getFeaturedLists()`

---

## 🧠 **6. Tag Pages**

### 6.1. **Tagged Film List Page** (`/tags/:tagName`)

- **Purpose:** Browse all films tagged with a specific tag.
- **Actions:**`getTaggedFilms(tagName)`

### 6.2. **Popular Tags Page** (`/tags`)

- **Purpose:** List of trending/popular tags.
- **Actions:**`getPopularTags()`

---

## 📊 **7. Box Office Pages**

### 7.1. **Daily/Weekly Box Office Page** (`/boxoffice/daily`, `/boxoffice/weekly`)

- **Purpose:** View regional box office collections.
- **Actions:**`getDailyBoxOffice()`, `getWeeklyBoxOffice()`

### 7.2. **Film ROI Page** (`/film/:filmId/roi`)

- **Purpose:** Display profitability, budget vs revenue.
- **Actions:**`getROIAnalysis()`

### 7.3. **Compare Films Page** (`/compare?filmA=...&filmB=...`)

- **Purpose:** Compare two films' box office data.
- **Actions:**`compareBoxOffice()`

---

## ✍️ **8. Blog Pages**

### 8.1. **Create/Edit Blog Page** (`/blogs/new`, `/blogs/edit/:blogId`)

- **Purpose:** Write cinema-focused blogs.
- **Components:** Rich text editor, tags, featured image.
- **Actions:**`createBlog()`, `editBlog()`

### 8.2. **Blog Detail Page** (`/blogs/:blogId`)

- **Purpose:** Read a single blog.
- **Actions:**`getBlogById()`

### 8.3. **User Blog List Page** (`/user/:userId/blogs`)

- **Purpose:** View all blogs by a user.
- **Actions:**`getBlogsByUser()`

### 8.4. **All Cinema Blogs Page** (`/blogs`)

- **Purpose:** Discover cinema-related articles.
- **Actions:**`getAllCinemaBlogs()`

---

## 💬 **9. Comment System (Component Level)**

- **Where Used:** Blogs, reviews, group posts, newsroom posts.
- **Actions:**`addCommentToPost()`, `deleteComment()`, `getCommentsByPost()`, `reportComment()`

---

## 👥 **10. Group Pages**

### 10.1. **Group Homepage** (`/groups`)

- **Purpose:** Discover public/private groups.
- **Actions:**`getAllGroups()`, `searchGroups()`

### 10.2. **Group Detail Page** (`/groups/:groupId`)

- **Purpose:** Posts, discussions, rules, members.
- **Actions:**`getGroupById()`, `getGroupPosts()`, `joinGroup()`, `leaveGroup()`, `postToGroup()`

### 10.3. **Create/Edit Group Page** (`/groups/new`, `/groups/edit/:groupId`)

- **Purpose:** Group settings, privacy, rules.
- **Actions:**`createGroup()`, `updateGroupDetails()`

### 10.4. **Moderation Dashboard (for group moderators)** (`/groups/:groupId/mod`)

- **Purpose:** Ban/mute users, edit rules, promote mods.

---

## 📰 **11. Newsroom Pages**

### 11.1. **Newsroom Homepage** (`/newsrooms`)

- **Purpose:** Browse editorial newsrooms.
- **Actions:**`getAllNewsrooms()`

### 11.2. **Newsroom Detail Page** (`/newsrooms/:newsroomId`)

- **Purpose:** Posts by editors, followers’ comments.
- **Actions:**`getNewsroomById()`, `getAllNewsPosts()`

### 11.3. **Create/Edit Newsroom Page** (`/newsrooms/new`, `/newsrooms/edit/:newsroomId`)

- **Purpose:** Controlled by editorial admins.
- **Actions:**`createNewsroom()`, `updateNewsroom()`

### 11.4. **News Post Editor** (`/newsrooms/:newsroomId/new-post`)

- **Actions:**`postNewsToNewsroom()`, `editNewsPost()`

---

## 🛡️ **12. Moderation Pages**

### 12.1. **Moderator Dashboard** (`/moderation`)

- **Purpose:** Review flagged content, manage users.
- **Actions:**`reviewFlaggedContent()`, `banUser()`, `warnUser()`, `resolveReport()`

---

## 📧 **13. Notification Page** (`/notifications`)

- **Purpose:** View and mark notifications.
- **Actions:**`getNotifications()`, `markAsRead()`

---

## 🌐 **Other Global Pages**

### ✅ **Homepage** (`/`)

- Trending films, spotlight reviews, featured blogs, group invites, call to action.

### 🔎 **Global Search Page** (`/search?q=`)

- Unified search: films, users, groups, blogs, tags.

### ⚙️ **Settings Page** (`/settings`)

- Account, password, notification preferences.

---

Would you like me to group these into **components**, **routes**, and **navigation structure** next?
