let currentPostId = null;

async function openPost(postId) {
    currentPostId = postId;
    showPage("post-page");
    await loadPost(); 
}

async function loadPost() {
    const { res, data } = await apiRequest(`${BASE_URL}/posts/${currentPostId}`);
    if (!res.ok) return;

    const post = data.data;
    const postImgHtml = (post.image && typeof post.image === 'string') 
        ? `<img src="${post.image}" class="post-img">` 
        : "";

    document.getElementById("post-details").innerHTML = `
        <div class="post-header">
            <img src="${post.author.profile_image || 'https://via.placeholder.com/40'}" class="avatar-sm">
            <strong>${post.author.username}</strong>
        </div>
        <p>${post.body}</p>
        ${postImgHtml}
    `;

    renderComments(post.comments);
}

function renderComments(comments) {
    const container = document.getElementById("comments-container");
    container.innerHTML = "";

    if (!comments || comments.length === 0) {
        container.innerHTML = "<p style='padding:20px; color:#888;'>No comments yet. Be the first!</p>";
        return;
    }

    comments.forEach(c => {
        container.innerHTML += `
            <div class="card" style="margin-bottom:10px; background:#f9f9f9;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                    <img src="${c.author.profile_image || 'https://via.placeholder.com/40'}" class="avatar-sm" style="width:30px; height:30px;">
                    <strong>${c.author.username}</strong>
                </div>
                <p style="margin:0; padding-left:40px;">${c.body}</p>
            </div>
        `;
    });
}

async function addComment() {
    const body = document.getElementById("comment-body").value;
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must login to comment!");
        return;
    }
    if (!body.trim()) return;

    const { res, data } = await apiRequest(`${BASE_URL}/posts/${currentPostId}/comments`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "body": body })
    });

    if (res.ok) {
        document.getElementById("comment-body").value = "";
        loadPost();
    } else {
        alert(data.message || "Failed to add comment");
    }
}

window.openPost = openPost;
window.addComment = addComment;