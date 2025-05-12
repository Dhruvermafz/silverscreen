## 🎬 **1. AuthController**

- `registerUser()`
- `loginUser()`
- `logoutUser()`
- `refreshToken()`
- `getCurrentUser()`

---

## 👤 **2. UserController**

- `getUserProfile(userId)`
- `updateUserProfile(userId)`
- `getWatchlist(userId)`
- `getFavorites(userId)`
- `getUserDiary(userId)`
- `getUserStats(userId)`
- `followUser(targetUserId)`
- `unfollowUser(targetUserId)`

---

## 🎥 **3. FilmController**

- `getFilmById(filmId)`
- `searchFilms(query)`
- `getTrendingFilms()`
- `getBoxOfficeData(filmId)`
- `getStreamingAvailability(filmId)`
- `getCastAndCrew(filmId)`

---

## 📝 **4. ReviewController**

- `addReview(filmId)`
- `editReview(reviewId)`
- `deleteReview(reviewId)`
- `getReviewsByFilm(filmId)`
- `getReviewsByUser(userId)`
- `toggleSpoiler(reviewId)`
- `rateReview(reviewId)`_(like/helpful/etc.)_

---

## 📚 **5. ListController**

- `createList()`
- `editList(listId)`
- `deleteList(listId)`
- `getListById(listId)`
- `addFilmToList(listId, filmId)`
- `removeFilmFromList(listId, filmId)`
- `getListsByUser(userId)`
- `getFeaturedLists()`

---

## 🧠 **6. TagController**

- `addTagToFilm(filmId)`
- `getTagsByFilm(filmId)`
- `getAllTags()`
- `getTaggedFilms(tagName)`
- `getPopularTags()`

---

## 📊 **7. BoxOfficeController**

- `getDailyBoxOffice(region)`
- `getWeeklyBoxOffice(region)`
- `compareBoxOffice(filmA, filmB)`
- `getBoxOfficeHistory(filmId)`
- `getROIAnalysis(filmId)`

---

## ✍️ **8. BlogController**

- `createBlog()`
- `editBlog(blogId)`
- `deleteBlog(blogId)`
- `getBlogById(blogId)`
- `getBlogsByUser(userId)`
- `getAllCinemaBlogs()`

---

## 💬 **9. CommentController**

- `addCommentToPost(postId)`
- `deleteComment(commentId)`
- `getCommentsByPost(postId)`
- `reportComment(commentId)`

---

## 👥 **10. **GroupController\*\*

> **Public or private communities** where any member can post, comment, or interact.

- `createGroup()`
- `updateGroupDetails(groupId)`
- `deleteGroup(groupId)`
- `joinGroup(groupId)`
- `leaveGroup(groupId)`
- `getGroupById(groupId)`
- `getGroupPosts(groupId)`
- `postToGroup(groupId)`
- `commentOnGroupPost(postId)`
- `promoteToModerator(groupId, userId)`
- `banUserFromGroup(groupId, userId)`
- `getAllGroups()`
- `searchGroups(query)`

---

### 📰 **NewsroomController**

> **Editorial-style rooms**, tightly moderated. Users can follow, react, comment _(if enabled)_, but **only approved moderators can post**.

- `createNewsroom()`
- `updateNewsroom(newsroomId)`
- `getNewsroomById(newsroomId)`
- `addNewsroomModerator(newsroomId, userId)`
- `postNewsToNewsroom(newsroomId)`
- `editNewsPost(postId)`
- `deleteNewsPost(postId)`
- `commentOnNewsPost(postId)`_(optional, can be toggled per post/newsroom)_
- `getAllNewsrooms()`
- `getAllNewsPosts(newsroomId)`
- `createGroup()`
- `joinGroup(groupId)`
- `leaveGroup(groupId)`
- `getGroupDetails(groupId)`
- `getGroupPosts(groupId)`
- `postToGroup(groupId)`

---

## 🛡️ **12. ModerationController**

- `flagContent(contentId, type)`
- `reviewFlaggedContent()`
- `banUser(userId)`
- `warnUser(userId)`
- `getReports()`
- `resolveReport(reportId)`

---

## 📧 **13. NotificationController**

- `sendNotification(userId)`
- `getNotifications(userId)`
- `markAsRead(notificationId)`

---

\*A GROUP CAN ACT AS A NEWROOM BUT A NEWSROOM CAN NOT BE GROUP, GROUP IS SOMETHING WHERE PEOPLE INTERACT BUT IN NEWSROOM ONLY FEW MODERATORS SHARE NEWS REGARDING SOMETHING

## 🔐 USER ROLES & PERMISSIONS

### 🎭 Global Roles:

- **User**: Can review, rate, comment, follow others, join groups, follow newsrooms.
- **Critic**: Verified reviewer badge. Extra visibility and potential early access.
- **Moderator**: Can moderate flagged content, manage reports in assigned groups/newsrooms.
- **Admin**: Full backend access, manage users, delete content platform-wide.
- **Filmmaker\***(optional)\*: Special profile features: film uploads, blogs, showreels.

---

## 👥 GROUP ROLES

| Role                | Permissions                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| **Group Creator**   | Full access. Can delete the group, assign roles, manage posts, ban users. |
| **Group Moderator** | Approve/decline posts, moderate comments, warn/kick/ban members.          |
| **Member**          | Can post, comment, like, tag, join discussions.                           |
| **Muted Member**    | Can read, cannot comment or post. Temporary punishment.                   |
| **Banned**          | Blocked from access entirely.                                             |

---

## 📰 NEWSROOM ROLES

| Role                 | Permissions                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| **Newsroom Creator** | Full control. Assign moderators, approve posts, delete newsroom.       |
| **Newsroom Editor**  | Can write, edit, delete posts. Cannot assign roles or delete newsroom. |
| **Follower**         | Can view all posts, optionally comment (if enabled), get updates.      |
| **Muted**            | Can view but cannot comment.                                           |
| **Banned**           | Removed from following or accessing the newsroom.                      |

---

## ⚖️ MODERATION FACILITIES

### 🚩 Content Moderation

- **Flag content**: Any user can flag a post/comment/review for:
  - Spam
  - Offensive/Abusive language
  - Irrelevant/Political content
  - Plagiarism
- **Auto-hide after X reports** (until reviewed by a mod)

---

### 🛡️ Moderator Tools

- **Dashboard**:
  - View flagged content
  - Resolve flags: dismiss, delete, warn, or ban
- **Actions**:
  - `warnUser(userId, reason)`
  - `muteUser(userId, duration)`
  - `banUser(userId)`
  - `restoreContent(contentId)`
  - `editGroupRules(groupId)`
- **Moderation Log**:
  - All actions by mods are tracked for transparency.

---

## 📜 RULES (Hardcoded + Editable per community)

### Platform-Wide Rules (Hardcoded)

1. ❌ **No political, religious, or hate speech.**
2. 🚫 **No NSFW or pirated content.**
3. 🎯 **Cinema-only discussion** – all blogs, groups, and reviews must stay on topic.
4. 🤖 **No spam, no self-promo without relevance (e.g., filmmakers only in profile/blogs).**
5. 📣 **Reviews must be original** — no copy-pasted content from other sites.

### Community Rules (Editable per Group/Newsroom)

- Group creators can define additional rules (e.g., “no spoilers without tags”)
- Newsroom creators can decide if comments are allowed per post

---

## 🧠 AUTOMATED SYSTEMS

- **Rate limit comments/posts** to avoid spamming
- **Shadowban repeat offenders** (flagged 5+ times in a week)
- **Auto-warn** on first violation, **auto-mute** on second, **auto-ban** on third (configurable)
- **AI-based moderation\***(optional later)\* to detect hate speech, political rhetoric, or off-topic content
