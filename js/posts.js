async function createNewPost() {
    const body = document.getElementById("post-body").value;
    const imageInput = document.getElementById("post-image");
    const imageFile = imageInput.files[0];
    
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must login first");
        return;
    }

    if (!body.trim() && !imageFile) {
        alert("Please write something or add an image");
        return;
    }

    const formData = new FormData();
    formData.append("body", body);
    
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        const { res, data } = await apiRequest(`${BASE_URL}/posts`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (res.ok) {
            document.getElementById("post-body").value = "";
            document.getElementById("post-image").value = ""; 
            getPosts(); 
        } else {
            alert(data.message || "Post failed");
        }
    } catch (err) {
        alert("Post error");
        console.error(err);
    }
}
window.createNewPost = createNewPost;

async function getPosts() {
    const container = document.getElementById("posts-container");
    if (!container) return;

    container.innerHTML = "<p class='loader'>Loading Posts...</p>";

    try {
        const { data } = await apiRequest(`${BASE_URL}/posts?limit=15`);
        const posts = data.data;
        container.innerHTML = "";

        const user = JSON.parse(localStorage.getItem("user") || "null");

        posts.forEach(post => {
            const isMyPost = user && post.author.id === user.id;
            const cleanBody = post.body.replace(/'/g, "\\'").replace(/\n/g, " ");

            container.innerHTML += `
                <div class="card">
                    <div class="post-header">
                        <img src="${post.author.profile_image || 'https://via.placeholder.com/40'}" class="avatar-sm">
                        <div>
                            <strong>${post.author.username}</strong><br>
                            <small>${post.created_at}</small>
                        </div>
                        ${isMyPost ? `
                        <div class="post-menu" style="margin-left:auto; position:relative;">
                            <button class="btn-text" onclick="toggleMenu(${post.id})"><img src="images/dropdown.svg" width="25px"></button>
                            <div id="menu-${post.id}" class="dropdown hidden">
                                <div onclick="editPost(${post.id}, '${cleanBody}')">Edit</div>
                                <div onclick="deletePost(${post.id})" style="color:red">Delete</div>
                            </div>
                        </div>
                        ` : ""}
                    </div>
                    
                    <div onclick="openPost(${post.id})" style="cursor:pointer">
                        <p>${post.body}</p>
                        ${post.image && typeof post.image === 'string' ? `<img src="${post.image}" class="post-img">` : ""}
                    </div>

                    <hr style="border: 0.5px solid #eee; margin-top: 15px;">
                    <div class="post-actions">
                        <button class="btn-action"><img src="images/love.svg" width="25px"> Like</button>
                        <button class="btn-action" onclick="openPost(${post.id})">
                            <img src="images/comment.svg" width="25px"> Comment (${post.comments_count})
                        </button>
                        <button class="btn-action" onclick="sharePost(${post.id})"><img src="images/share.svg" width="25px"> Share</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        container.innerHTML = "<p>Error loading posts</p>";
    }
}


window.sharePost = function(postId) {
    alert("Post ID: " + postId + " link copied!");
};


async function editPost(postId, oldBody) {
    const newBody = prompt("تعديل المنشور:", oldBody);
    if (!newBody || newBody.trim() === "") return;

    const token = localStorage.getItem("token");

    try {
        const { res, data } = await apiRequest(`${BASE_URL}/posts/${postId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ body: newBody })
        });

        if (res.ok) {
            getPosts(); 
        } else {
            alert(data.message || "فشل التعديل");
        }
    } catch (err) {
        console.error("Edit error:", err);
    }
}


async function deletePost(postId) {
    if (!confirm("هل أنت متأكد من حذف هذا المنشور؟")) return;

    const token = localStorage.getItem("token");

    try {
        const { res } = await apiRequest(`${BASE_URL}/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            getPosts();
        } else {
            alert("فشل الحذف");
        }
    } catch (err) {
        console.error("Delete error:", err);
    }
}

window.editPost = editPost;
window.deletePost = deletePost;
window.toggleMenu = function(postId) {
    const menu = document.getElementById(`menu-${postId}`);
    if (menu) menu.classList.toggle("hidden");
};


async function getPosts() {
    const container = document.getElementById("posts-container");
    if (!container) return;

    container.innerHTML = "<p class='loader'>Loading Posts...</p>";

    try {
        const { data } = await apiRequest(`${BASE_URL}/posts?limit=15`);
        const posts = data.data;
        container.innerHTML = "";

        const user = JSON.parse(localStorage.getItem("user") || "null");

        posts.forEach(post => {
            const isMyPost = user && post.author.id === user.id;
            const cleanBody = post.body.replace(/'/g, "\\'").replace(/\n/g, " ");

            container.innerHTML += `
                <div class="card">
                    <div class="post-header">
                        <img src="${post.author.profile_image || 'https://via.placeholder.com/40'}" class="avatar-sm">
                        <div>
                            <strong>${post.author.username}</strong><br>
                            <small>${post.created_at}</small>
                        </div>
                        ${isMyPost ? `
                        <div class="post-menu" style="margin-left:auto; position:relative;">
                            <button class="btn-text" onclick="toggleMenu(${post.id})"><img src="images/dropdown.svg" width="25px"></button>
                            <div id="menu-${post.id}" class="dropdown hidden">
                                <div onclick="editPost(${post.id}, '${cleanBody}')">Edit</div>
                                <div onclick="deletePost(${post.id})" style="color:red">Delete</div>
                            </div>
                        </div>
                        ` : ""}
                    </div>
                    
                    <div onclick="openPost(${post.id})" style="cursor:pointer">
                        <p>${post.body}</p>
${(post.image && typeof post.image === 'string') ? `<img src="${post.image}" class="post-img">` : ""}
                    </div>

                    <hr style="border: 0.5px solid #eee; margin-top: 15px;">
                    <div class="post-actions">
                        <button class="btn-action"><img src="images/love.svg" width="25px"> Like</button>
                        <button class="btn-action" onclick="openPost(${post.id})">
                            <img src="images/comment.svg" width="25px"> Comment (${post.comments_count})
                        </button>
                        <button class="btn-action" onclick="sharePost(${post.id})"><img src="images/share.svg" width="25px"> Share</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        container.innerHTML = "<p>Error loading posts</p>";
    }
}