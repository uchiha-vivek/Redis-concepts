async function login() {
    const username = document.getElementById("username").value;
    // console.log('username : ',username)
    if (!username) return alert("Enter username");

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    });
    const data = await res.json();

    if (res.ok) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("user-info").style.display = "block";
        document.getElementById("welcome").innerText = `Welcome, ${data.username}`;
        getMe();
    } else {
        alert(data.error);
    }
}

async function logout() {
    await fetch("/logout", { method: "POST" });
    document.getElementById("login-form").style.display = "block";
    document.getElementById("user-info").style.display = "none";
}

async function getMe() {
    const res = await fetch("/me");
    const data = await res.json();
    // console.log('Response : ',res)
    if (res.ok) {
        document.getElementById("welcome").innerText = `Welcome, ${data.username}`;
        document.getElementById("visits").innerText = `You have visited ${data.views} times this session.`;
    } else {
        alert(data.error);
    }
}
