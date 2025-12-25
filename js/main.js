// Navbar buttons
document.getElementById("logo").addEventListener("click", goToHome);
document.getElementById("btn-home").addEventListener("click", goToHome);
document.getElementById("btn-show-login").addEventListener("click", () => showPage("login-page"));
document.getElementById("btn-show-signup").addEventListener("click", () => showPage("signup-page"));
document.getElementById("btn-profile").addEventListener("click", openProfile);
document.getElementById("btn-logout").addEventListener("click", logout);

// Load pages
loadPage("pages/home.html", "home-page", () => { setupUI(); getPosts(); });
loadPage("pages/login.html", "login-page");
loadPage("pages/signup.html", "signup-page");
loadPage("pages/profile.html", "profile-page");
loadPage("pages/post.html", "post-page");
