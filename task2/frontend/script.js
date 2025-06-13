// Get logged-in user from localStorage
const loggedInUser = JSON.parse(localStorage.getItem("user"));
const loggedInUserId = loggedInUser?._id;

// Render navbar
function renderNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navbar = document.getElementById("navbar");

  if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  navbar.innerHTML = `
    <a href="index.html">Home</a>
    <a href="post.html">Create Post</a>
    <a href="feed.html">Feed</a>
    <a href="profile.html">Profile (@${user.username})</a>
    <a href="#" id="logoutBtn">Logout</a>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}

// Load posts on homepage or feed
if (window.location.pathname.includes("index.html") || window.location.pathname.includes("feed.html")) {
  loadPosts();
}

async function loadPosts() {
  const feed = document.getElementById("postsContainer");
  if (!feed) return;

  feed.innerHTML = "";

  try {
    const res = await fetch("http://localhost:5000/api/posts");
    const posts = await res.json();

    posts.forEach(post => {
      const postEl = document.createElement("div");
      postEl.classList.add("post");

      postEl.innerHTML = `
        <div class="post-header">
          <img src="${post.user.profilePic}" alt="${post.user.username}" class="avatar" />
          <h4><a href="profile.html?userId=${post.user._id}">@${post.user.username}</a></h4>
        </div>
        <img src="${post.image}" alt="Post image" class="post-img" />
        <div class="post-body">
          <p><strong>${post.user.username}</strong> ${post.caption}</p>
          
          ${post.user._id !== loggedInUserId ? `
            <button class="follow-btn" data-userid="${post.user._id}"
              style="margin-top: 5px; padding: 5px 10px;
                     background-color: ${post.user.followers.includes(loggedInUserId) ? 'red' : 'green'};
                     color: white; border: none; border-radius: 5px;">
              ${post.user.followers.includes(loggedInUserId) ? 'Unfollow' : 'Follow'}
            </button>
          ` : ""}

          <p>
            <button class="like-btn" data-postid="${post._id}">
              ${post.likes.includes(loggedInUserId) ? "❤️ Unlike" : "🤍 Like"}
            </button>
            <span class="like-count">${post.likes.length} likes</span>
            <span class="comment-toggle-btn" data-postid="${post._id}" style="margin-left: 20px; cursor: pointer;">
              💬 ${post.commentsCount || 0}
            </span>
            ${post.user._id === loggedInUserId
  ? `<button class="delete-btn" data-id="${post._id}" style="margin-top:5px;">🗑️ Delete</button>`
  : ""}

          </p>
        </div>
      `;

      const commentsSection = document.createElement("div");
      commentsSection.classList.add("comments-section");
      commentsSection.style.display = "none";
      postEl.appendChild(commentsSection);

      postEl.querySelector(".comment-toggle-btn").addEventListener("click", () => {
        if (commentsSection.style.display === "none") {
          commentsSection.style.display = "block";
          showCommentsSection(post._id, commentsSection);
        } else {
          commentsSection.style.display = "none";
        }
      });

      feed.appendChild(postEl);
    });

  } catch (err) {
    console.error("Failed to load posts", err);
  }
}

async function showCommentsSection(postId, container) {
  container.innerHTML = "<p>Loading comments...</p>";

  try {
    const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
    const allComments = await res.json();

    const commentsMap = {};
    allComments.forEach(c => {
      c.replies = [];
      commentsMap[c._id] = c;
    });

    const topLevel = [];
    allComments.forEach(c => {
      if (c.parentComment) {
        commentsMap[c.parentComment]?.replies.push(c);
      } else {
        topLevel.push(c);
      }
    });

    container.innerHTML = "";
    const commentsList = document.createElement("div");

    function renderComment(comment, depth = 0) {
      const commentEl = document.createElement("div");
      commentEl.classList.add("comment-item");
      commentEl.style.marginLeft = `${depth * 20}px`;

      commentEl.innerHTML = `
        <strong>${comment.user.username}</strong>: ${comment.text}
        ${comment.user._id === loggedInUserId ? `<span class="delete-comment-btn" data-commentid="${comment._id}" style="margin-left: 10px; cursor: pointer; color: red;">🗑️</span>` : ""}
        <span class="reply-icon" style="margin-left: 10px; cursor: pointer; color:white;">↩️ Reply</span>
      `;

      const replyForm = document.createElement("form");
      replyForm.style.display = "none";
      replyForm.style.marginTop = "5px";
      replyForm.innerHTML = `
        <input type="text" placeholder="Write a reply..." required style="padding: 5px; width: 60%;" />
        <button type="submit">Reply</button>
      `;
      commentEl.appendChild(replyForm);

      commentEl.querySelector(".reply-icon").addEventListener("click", () => {
        replyForm.style.display = replyForm.style.display === "none" ? "block" : "none";
      });

      replyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = replyForm.querySelector("input").value.trim();
        if (!text) return;
        try {
          await fetch("http://localhost:5000/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId,
              userId: loggedInUserId,
              text,
              parentComment: comment._id,
            })
          });
          showCommentsSection(postId, container);
        } catch (err) {
          alert(err.message);
        }
      });

      commentEl.querySelector(".delete-comment-btn")?.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this comment?")) {
          try {
            await fetch(`http://localhost:5000/api/comments/${comment._id}`, { method: "DELETE" });
            showCommentsSection(postId, container);
          } catch (err) {
            alert("Failed to delete comment");
          }
        }
      });

      commentsList.appendChild(commentEl);
      comment.replies.forEach(reply => renderComment(reply, depth + 1));
    }

    topLevel.forEach(comment => renderComment(comment));
    container.appendChild(commentsList);

    const form = document.createElement("form");
    form.innerHTML = `
      <input type="text" placeholder="Add a comment..." required style="width: 70%;" />
      <button type="submit">Post</button>
    `;
    container.appendChild(form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = form.querySelector("input").value.trim();
      if (!text) return;

      try {
        await fetch("http://localhost:5000/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, userId: loggedInUserId, text, parentComment: null }),
        });
        showCommentsSection(postId, container);
      } catch (err) {
        alert(err.message);
      }
    });

  } catch (err) {
    container.innerHTML = "<p>Failed to load comments</p>";
  }
}

// Like and Follow Handling
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("like-btn")) {
    const postId = e.target.dataset.postid;
    const likeBtn = e.target;
    const likeCountSpan = likeBtn.nextElementSibling;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId })
      });

      if (!res.ok) throw new Error("Failed to like/unlike");

      const isLiked = likeBtn.textContent.includes("❤️");
      likeBtn.textContent = isLiked ? "🤍 Like" : "❤️ Unlike";

      let currentCount = parseInt(likeCountSpan.textContent);
      likeCountSpan.textContent = isLiked
        ? `${currentCount - 1} likes`
        : `${currentCount + 1} likes`;

    } catch (err) {
      alert(err.message);
    }
  }

  if (e.target.classList.contains("follow-btn")) {
  const btn = e.target;
  const targetUserId = btn.dataset.userid;
  const isFollow = btn.textContent.trim().toLowerCase() === "follow";

  const endpoint = isFollow ? "follow" : "unfollow";

  try {
    const res = await fetch(`http://localhost:5000/api/follows/${endpoint}/${targetUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentUserId: loggedInUserId }),
    });

    if (!res.ok) throw new Error("Follow/Unfollow failed");

    btn.textContent = isFollow ? "Unfollow" : "Follow";
    btn.style.backgroundColor = isFollow ? "red" : "green";
  } catch (err) {
    alert("Failed to " + (isFollow ? "follow" : "unfollow") + ": " + err.message);
  }
}

});

// New Post Submission
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();

  const postForm = document.getElementById("postForm");
  if (postForm) {
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const caption = document.getElementById("postCaption").value;
      const image = document.getElementById("postImage").value;

      try {
        const res = await fetch("http://localhost:5000/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedInUserId, caption, image })
        });
        if (!res.ok) throw new Error("Failed to post");
        alert("Posted successfully!");
        postForm.reset();
        loadPosts();
      } catch (err) {
        alert(err.message);
      }
    });
  }
});

//profile page
async function loadUserProfile(userId) {
  const profileHeader = document.getElementById("profileHeader");
  const postContainer = document.getElementById("userPosts");

  if (!profileHeader || !postContainer) {
    console.error("Missing profileHeader or userPosts container in HTML");
    return;
  }

  try {
    // Fetch user data
    const userRes = await fetch(`http://localhost:5000/api/users/id/${userId}`);
    if (!userRes.ok) throw new Error("Failed to fetch user data");
    const userData = await userRes.json();

    // Display user info in header
    profileHeader.innerHTML = `
      <img src="${userData.profilePic || 'https://via.placeholder.com/100'}" class="profile-pic" alt="Profile Pic"/>
      <div>
        <h2>@${userData.username}</h2>
        <p>Bio: <span>${userData.bio || "No bio set"}</span></p>
        <p>Followers: ${userData.followers.length} | Following: ${userData.following.length}</p>
      </div>
    `;

    // Clear previous posts before adding new ones
    postContainer.innerHTML = "";

    // Fetch posts by user
    const postRes = await fetch(`http://localhost:5000/api/posts/user/${userId}`);
    if (!postRes.ok) throw new Error("Failed to fetch posts");
    const posts = await postRes.json();

    if (posts.length === 0) {
      postContainer.innerHTML = "<p>No posts to show.</p>";
      return;
    }
posts.forEach(post => {
  const div = document.createElement("div");
  div.classList.add("post");
  
  // Instead of rendering comments directly, show comment icon button
  const commentsCount = post.comments ? post.comments.length : 0;
  
  div.innerHTML = `
    <img src="${post.image}" alt="Post image" class="post-img" />
    <p>${post.caption}</p>
    <small>❤️ ${post.likes.length} likes</small>
    <button class="comment-toggle-btn" data-postid="${post._id}">
      💬 ${commentsCount} Comment${commentsCount !== 1 ? "s" : ""}
    </button>
    <div class="comments-container" id="comments-${post._id}" style="display:none; margin-top:10px;"></div>
    ${loggedInUser._id === post.user._id ? `<button class="delete-btn" data-id="${post._id}">Delete</button>` : ""}
    <hr/>
  `;
  postContainer.appendChild(div);
});


  } catch (err) {
    console.error("Error loading user profile:", err);
    profileHeader.innerHTML = "<p>Failed to load profile.</p>";
    postContainer.innerHTML = "";
  }
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("comment-toggle-btn")) {
    const postId = e.target.dataset.postid;
    const commentsDiv = document.getElementById(`comments-${postId}`);

    if (!commentsDiv) return;

    if (commentsDiv.style.display === "none" || commentsDiv.innerHTML === "") {
      // Show comments
      try {
        const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
        const comments = await res.json();

        if (comments.length === 0) {
          commentsDiv.innerHTML = "<p>No comments yet.</p>";
        } else {
          commentsDiv.innerHTML = comments.map(c => `
            <div class="comment">
              <strong>@${c.user?.username || "unknown"}:</strong> ${c.text}
            </div>
          `).join("");
        }

        commentsDiv.style.display = "block";
      } catch (err) {
        console.error("Error loading comments:", err);
        commentsDiv.innerHTML = "<p>Error loading comments.</p>";
        commentsDiv.style.display = "block";
      }
    } else {
      // Hide comments
      commentsDiv.style.display = "none";
    }
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const postId = e.target.dataset.id;
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (res.ok) {
        alert("Post deleted successfully");
        e.target.closest(".post").remove(); // Remove from DOM
      } else {
        alert(result.error || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post");
    }
  }
});
async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message || "Deleted");

    // Refresh profile posts
    loadUserProfile(loggedInUser._id);
  } catch (err) {
    alert("Error deleting post");
    console.error(err);
  }
}


if (window.location.pathname.includes("profile.html")) {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId") || loggedInUserId;
  loadUserProfile(userId);
}
