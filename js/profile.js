function openProfile() { showPage("profile-page"); loadProfile(); }

async function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if(!user) return;

  const container = document.getElementById("profile-page");
  container.innerHTML = `
    <section class="card profile-card">
      <img src="${user.profile_image || 'https://via.placeholder.com/100'}" class="avatar-lg">
      <h2>${user.name}</h2>
      <p>@${user.username}</p>
    </section>
  `;

  const res = await fetch(`${BASE_URL}/users/${user.id}/posts`);
  const json = await res.json();
  json.data.forEach(post => {
    container.innerHTML += `<div class="card"><p>${post.body}</p></div>`;
  });
}
