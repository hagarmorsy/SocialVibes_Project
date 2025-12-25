async function login() {
  const username = document.getElementById("login-user").value;
  const password = document.getElementById("login-pass").value;
  if (!username || !password) return alert("Enter username and password");

  try {
    const { res, data } = await apiRequest(`${BASE_URL}/login`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ username, password })
    });

    if(res.ok){
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setupUI();
      goToHome();
    } else alert(data.message);
  } catch(err){ alert("Login failed"); console.error(err);}
}

async function register() {
    const name = document.getElementById("reg-name").value;
    const username = document.getElementById("reg-user").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-pass").value;
    const imageInput = document.getElementById("reg-img");
    const imageFile = imageInput.files[0]; 

    if (!name || !username || !email || !password) {
        alert("Fill all fields");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    
    
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        const { res, data } = await apiRequest(`${BASE_URL}/register`, {
            method: "POST",
            body: formData 
        });

        if (res.ok) {
            alert("Account created successfully");
            showPage("login-page");
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Signup failed");
        console.error(err);
    }
}
window.register = register;
function logout() {
    localStorage.clear();
    setupUI();  
    goToHome(); } 
