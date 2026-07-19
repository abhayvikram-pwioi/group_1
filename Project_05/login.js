const loginForm = document.getElementById("loginForm");

const togglePassword = document.getElementById("togglePassword");

const password = document.getElementById("password");

togglePassword.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";

        togglePassword.classList.replace("fa-eye","fa-eye-slash");

    }

    else{

        password.type = "password";

        togglePassword.classList.replace("fa-eye-slash","fa-eye");

    }

});

loginForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const workspaceId=document.getElementById("workspaceId").value.trim();

    const email=document.getElementById("email").value.trim();

    const passwordValue=password.value;

    const workspace=JSON.parse(localStorage.getItem(workspaceId));

    if(!workspace){

        alert("Workspace not found");

        return;

    }

    const isAdmin=workspace.admin &&
    workspace.admin.email===email &&
    workspace.password===passwordValue;

    const isMember=workspace.members.some(member=>
        member.email===email
    );

    if(isAdmin || isMember){

        localStorage.setItem("currentWorkspace",workspaceId);

        localStorage.setItem("currentUser",email);

        localStorage.setItem("isLoggedIn","true");

        window.location.href="index.html";

    }

    else{

        alert("Invalid Email or Password");

    }

});