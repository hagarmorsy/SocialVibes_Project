async function loadPage(url, containerId) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (err) {
        console.error("Error loading page:", url, err);
    }
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    
    if (pageId === "home-page") {
        getPosts();
    }
}

function goToHome() {
    showPage("home-page");
}

function setupUI() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const guestLinks = document.getElementById("guest-links");
    const userLinks = document.getElementById("user-links");
    const createPostBox = document.getElementById("create-post-box");

    if (token && user) {
        if(guestLinks) guestLinks.classList.add("hidden");
        if(userLinks) userLinks.classList.remove("hidden");
        if(createPostBox) createPostBox.classList.remove("hidden");

        document.getElementById("nav-username").innerText = user.username;
        document.getElementById("nav-avatar").src = user.profile_image || "https://via.placeholder.com/40";
        
        const formAvatar = document.getElementById("form-avatar");
        if(formAvatar) formAvatar.src = user.profile_image || "https://via.placeholder.com/40";
    } else {
        if(guestLinks) guestLinks.classList.remove("hidden");
        if(userLinks) userLinks.classList.add("hidden");
        if(createPostBox) createPostBox.classList.add("hidden");
    }
}
