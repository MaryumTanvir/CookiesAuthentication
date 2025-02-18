$(document).ready(function () {
    

    $("#show-signup").click(function () {
        $(".container").hide();
        $("#signup-container").show();
    });

    $("#show-login").click(function () {
        $(".container").hide();
        $("#login-form").parent().show();
    });

   
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        } else {
            expires = "; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Expire immediately for logout
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/; " + expires + "; SameSite=Lax";
    }
    


    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === encodeURIComponent(name) || key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }
    

    
    $("#signup-form").submit(function (e) {
        e.preventDefault();
        const username = $("#signup-username").val();
        const email = $("#signup-email").val();
        const password = $("#signup-password").val();

        if (!username || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        
        if (getCookie(email)) {
            alert("User already exists! Please login.");
            return;
        }

       
        setCookie(email, btoa(JSON.stringify({ username, password })), 365); 

        alert("Signup successful! You can now login.");

        
        $("#signup-form")[0].reset();
        $("#show-login").click();
    });

    
    $("#login-form").submit(function (e) {
        e.preventDefault();
        const email = $("#login-email").val();
        const password = $("#login-password").val();

       
        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        
        const storedUser = getCookie(email);

        
        if (!storedUser) {
            alert("User not found! Please sign up first.");
            return;
        }

        const userData = JSON.parse(atob(storedUser));

        
        if (userData.password !== password) {
            alert("Incorrect password!");
            return;
        }
       
        setCookie("userSession", email, 1); 

        window.location.href = "./dashboard.html";
    });


    if (window.location.pathname.includes("dashboard.html")) {
        const userEmail = getCookie("userSession");

        if (!userEmail) {
            alert("You must be logged in to access the dashboard!");
            window.location.href = "index.html";
        } else {
            const storedUser = getCookie(userEmail);
            if (storedUser) {
                const userData = JSON.parse(atob(storedUser));
                $("#username").text(userData.username);
            } else {
                alert("Session expired. Please login again.");
                window.location.href = "index.html";
            }
        }
    }

   
    $(document).on("click", "#logout", function () {
        
        document.cookie = "userSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
        
        window.location.href = "index.html";
    });
    
});
