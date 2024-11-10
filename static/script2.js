let sets;
let answers;

function load(username, setdata){
    document.getElementById("greeting").textContent = `Hello, ${username}`;
    let date = new Date();
    document.getElementById("dateTime").textContent = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    console.log(date);
    setdata.pop();
    let setBtn;
    let setName;
    let setPfp;
    for(let i=0; i < setdata.length; i++){
        setBtn = document.createElement("button");
        setName = document.createElement("h4");
        setName.innerText = setdata[i].split("\n")[0];
        setPfp = document.createElement("img");
        setPfp.src = setdata[i].split("\n")[6];
        setBtn.appendChild(setName);
        setBtn.appendChild(setPfp);
        setBtn.onclick = () => rdrctSettings(setdata[i].split("\n"));
        document.getElementById("btnHolder").appendChild(setBtn);
    }
}

function rdrctSettings(set){
    fetch("/settings",{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"data":set})
    })

    .then(response=>{
        if(!response.ok){
            console.log("response was not in fact okay");
        }else{
            return response.json();
        }
    })

    .then(data=>{
        if(data.message == "euge"){
            window.location.href = data.redirect;
        }else{
            console.log("eheu!!!")
        }
    })

    .catch(error=>{
        console.log(error);
    })
}

function rdrctTest(set){
    fetch("/testset",{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"data":set})
    })

    .then(response=>{
        if(!response.ok){
            console.log("Eheu response is sad");
        }else{
            return response.json();
        }
    })

    .then(data=>{
        if(data.message=="euge"){
            window.location.href = data.redirect;
        }else{
            console.log("eheu!!");
        }
    })
}

function create(){
   fetch("/create",{
    method: "POST",
    headers: {
        "Content-Type":"application/json"
    }
   })

   .then(response=>{
        if(!response.ok){
            console.log("RESPONSE ARE YOU OKAY?");
        }else{
            return response.json();
        }
   })

   .then(data=>{
        window.location.href = data.redirect;
   })
}

function send(){
    let notes = document.getElementById("dgtlNotes").value;
    let num = document.getElementById("number").value;
    let name = document.getElementById("setname").value;
    let pfp = document.getElementById("setpfp").value;
    let desc = document.getElementById("desc").value;
    let errMsg = document.getElementById("errMsg");
    if(name == ""){
        errMsg.innerText = "Give your kit a name :3";
    }else if(pfp == ""){
        errMsg.innerText = "Upload a photo :3"
    }else if(valid(pfp) == false){
        errMsg.innerHTML = "Try a different photo url-- this appears to be invalid :3";
    }else if(notes == ""){
        errMsg.innerText = "Can't generate without notes :3";
    }else if(num == ""){
        errMsg.innerText = "How many questions should we generate? :3";
    }else{
        fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"data":[notes,num,name,pfp,desc]})
        })
        .then(response=>{
            if(!response.ok){
                console.log("RESPONSE ARE YOU OKAY?")
            }else{
                return response.json()
            }
        })
        .then(data=>{
            if(data.message=="euge"){
               window.location.href = data.redirect;
            }else{
                console.log("eheu!!!!");
            }
        })
        .catch(error=>{
            console.log(error);
        })
    }
}

let questions;
let qNum = 0;
let totalQnum = 0;
let totalQs = 0;
let choices;
let crrctAns = 0;

function setup(set){
    document.getElementById("setName").innerText = set[0];
    questions = JSON.parse(set[1]);
    choices = JSON.parse(set[2]);
    answers = JSON.parse(set[3]);
    qNum = Math.floor(Math.random() * (questions.length-1));
    totalQs = questions.length;
    testSet(questions, choices);
}

function testSet(){
    if(totalQnum >= totalQs){    
        document.getElementById("stats").innerText = "You got " + crrctAns.toString() + "/" + totalQs.toString() + " correct";
        document.getElementById("nextBtn").style.display = "none";
    }else{
        document.getElementById("qNums").innerText = "Question " + (totalQnum+1).toString() + " of " + totalQs.toString();
        document.getElementById("question").innerText = questions[qNum];
        for(let i = 0; i < 4; i++){
            let letters = ["a", "b", "c", "d"]
            document.getElementById(letters[i]).innerText = choices[qNum][i];
        }
        document.getElementById("nextBtn").style.display = "none";
        document.querySelector('input[name="option"]:checked').checked = false;
        document.getElementById("correct").innerText = "";
        document.getElementById("checkBtn").style.display = "block";
    }
}

function checkAnswer(){
    let slcted = document.querySelector('input[name="option"]:checked').value;
    let answer = answers[qNum];
    if(slcted == answer){
        document.getElementById("correct").textContent = "correct";
        crrctAns += 1;
    }else{
        let question = questions[qNum];
        let right = document.getElementById(answer).innerText;
        let wrong = document.getElementById(slcted).innerText;

        fetch("/explain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"data":[question, right, wrong]})
        })

        .then(response=>{
            if(!response.ok){
                console.log("response not okay :(");
            }else{
                return response.json();
            }
        })

        .then(data=>{
            if(data.message == "euge"){
                document.getElementById("correct").innerText = data.explanation;
            }else{
                console.log("EHEU!!!");
            }
        })
    }
    questions.splice(qNum, 1);
    choices.splice(qNum, 1);
    answers.splice(qNum, 1);
    qNum = Math.floor(Math.random() * (questions.length-1));
    totalQnum += 1;
    document.getElementById("nextBtn").style.display = "block";
    document.getElementById("checkBtn").style.display = "none";
}

function returnHome(){
    fetch("/rdrctMain",{
     method: "POST",
     headers: {
         "Content-Type":"application/json"
     }
    })
 
    .then(response=>{
         if(!response.ok){
             console.log("RESPONSE ARE YOU OKAY?");
         }else{
             return response.json();
         }
    })
 
    .then(data=>{
         window.location.href = data.redirect;
    })
 }

function updatepfp(){
    let pfpUrl = document.getElementById("setpfp").value;
    document.getElementById("pfp").src = pfpUrl;
}

function loadStngs(set){
    document.getElementById("cnfrm").style.display = "none";
    document.getElementById("name").textContent = set[0];
    document.getElementById("pfp").src = set[6];
    document.getElementById("desc").textContent = set[5];
    document.getElementById("test").onclick = () => rdrctTest(set);
    document.getElementById("delete").onclick = () => dltPrompt(set);
}

function dltPrompt(set){
    document.getElementById("cnfrm").style.display = "block";
    document.getElementById("cnfrmDel").onclick = () => dltSet(set);
}

function dltSet(set){
    fetch("/dltSet",{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"data":set})
    })
    .then(response=>{
        if(!response.ok){
            console.log("Eheu response unokay");
        }else{
            return response.json();
        }
    })
    .then(data=>{
        if(data.message == "euge"){
            window.location.href = data.redirect;
        }else{
            console.log("EHEU!!!")
        }
    })
    .catch(error=>{
        console.log(error);
    })
}

function cnclDel(){
    document.getElementById("cnfrm").style.display = "none";
}

function checkNum(){
    let num = document.getElementById("number");
    if(num.value>50){
        num.value = 50;
    }else if(num.value<10){
        num.value = 10;
    }
}

function dblCheck(){
    let pfp= document.getElementById("pfp");
    if(pfp.value == ""){
        pfp.src="https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
    }
}

function valid(src){
    try{
      new URL(src);
      return true;
    }catch(error){
      return false;
    }
}