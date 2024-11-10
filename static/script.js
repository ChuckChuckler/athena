function rdrctLogup(){
    fetch("/spawnpoint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })

    .then(response=>{
        if(!response.ok){
            console.log("response not ok oh nooo");
        }else{
            return response.json();
        }
    })

    .then(data=>{
        window.location.href = data.redirect;
    })

    .catch(error=>{
        console.log(error);
    })
}

function signup(){
    let user = document.getElementById("gkruser").value;
    let pass = document.getElementById("gkrpass").value;
    if(user == ""){
        document.getElementById("errMsg").innerText = "No username entered :(";
    }else if(pass == ""){
        document.getElementById("errMsg").innerText = "No password entered :(";
    }else{
        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: [user, pass]})
        })
    
        .then(response=>{
            if(!response.ok){
                console.log("Error response is sad and mizukified");
            }else{
                return response.json();
            }
        })
    
        .then(data=>{
            if(data.message == "euge"){
                console.log("eugepae!!!");
                document.getElementById("errMsg").innerText = "Account created! Log in with your new details :3";
            }else{
                document.getElementById("errMsg").innerText = data.message;
            }
        })
    
        .catch(error=>{
            console.log(error);
        })
    }
}

function login(){
    let user = document.getElementById("gkruser2").value;
    let pass = document.getElementById("gkrpass2").value;
    if(user == ""){
        document.getElementById("errMsg").innerText = "No username entered";
    }else if(pass == ""){
        document.getElementById("errMsg").innerText = "No password entered";
    }else{
        fetch("/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: [user, pass]})
        })
    
        .then(response=>{
            if(!response.ok){
                console.log("response are you okay :(");
            }else{
                return response.json();
            }
        })
    
        .then(data=>{
            if(data.message=="euge"){
                console.log("eugepae");
                window.location.href = data.redirect;
            }else{
                document.getElementById("errMsg").innerText = data.message;
            }
        })
    
        .catch(error=>{
            console.log(error);
        })
    }
}