document.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click",()=>{
        const title=card.querySelector("h2").innerText;

        if(title==="Create Resume"){
            window.location.href = "create_resume.html";
        }
        else if(title==="Update Resume"){
            window.location.href = "upload_resume.html";
        }
        else if(title==="My Resumes"){
            window.location.href = "my_resumes.html";
        }
        else{
            if(confirm("Are you sure you want to logout?")){
                window.location.href="login.html";
            }
        }
    });
});