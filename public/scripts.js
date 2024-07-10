document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        // Optionally, store token in localStorage or sessionStorage
      })
      .catch(error => {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
      });
  });

  signupForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.text())
      .then(data => {
        alert(data);
      })
      .catch(error => {
        console.error("Signup error:", error);
        alert("Signup failed. Please try again.");
      });
  });
});
