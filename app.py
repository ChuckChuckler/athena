from flask import Flask, json, jsonify, render_template, request
import hashlib
import sqlite3
import google.generativeai as genai

apikey = "" #replace with actual api key

genai.configure(api_key=apikey)

user = ""
passw = ""
passw_encd = ""

app = Flask(__name__, template_folder="templates", static_folder="static")

@app.route("/")
def index():
    return render_template("spawn.html")

@app.route("/spawnpoint", methods=["GET", "POST"])
def spawnpoint():
    return jsonify({"redirect":"/rdrctLogup"})

@app.route("/rdrctLogup")
def rdrctLogup():
    return render_template("logup.html")

@app.route("/signup", methods=["GET","POST"])
def signup():
    if not request.json:
        print("uhh no json response?")
        return jsonify({"message" : "eheu"})
    elif "data" not in request.json:
        print("no data in json lolol")
        return jsonify({"message":"eheu"})
    else:
        global user
        global passw
        global passw_encd
        conn = sqlite3.connect("userdata.db")
        curr = conn.cursor()
        curr.execute("CREATE TABLE IF NOT EXISTS userdata(username, password, sets)")
        data = request.json["data"]
        user = data[0]
        passw = data[1]
        passw_encd = bytes(str(passw), encoding="utf-8")
        passw_encd = hashlib.sha256(passw_encd, usedforsecurity=True).hexdigest()
        if (user,) in curr.execute("SELECT username FROM userdata").fetchall():
            print("username already exists")
            return jsonify({"message": "Username already exists :("})
        else:
            sets = json.dumps([[]])
            curr.execute("INSERT INTO userdata VALUES (?,?,?)", (user, passw_encd, sets))
            conn.commit()
            conn.close()
            return jsonify({"message":"euge"})
        
@app.route("/login", methods=["POST", "GET"])
def login():
    if not request.json:
        print("no json found")
        return jsonify({"message": "no json found"})
    elif "data" not in request.json:
        print("data not in json")
        return jsonify({"message": "data not in json"})
    else:
        global user
        global passw
        global passw_encd
        data = request.json["data"]
        user = data[0]
        passw = data[1]
        passw_encd = bytes(str(passw), encoding="utf-8")
        passw_encd = hashlib.sha256(passw_encd, usedforsecurity=True).hexdigest()
        conn = sqlite3.connect("userdata.db")
        curr = conn.cursor()
        if (user,) not in curr.execute("SELECT username FROM userdata").fetchall():
            print("user not found")
            conn.close()
            return jsonify({"message":"Username not found :("})
        else:
            if (user, passw_encd) not in curr.execute("SELECT username, password FROM userdata"):
                print("incorrect password")
                conn.close()
                return jsonify({"message":"Incorrect password :("})
            else:
                print("euge logged in")
                conn.close()
                return jsonify({"message":"euge", "redirect":"/main"})
            
@app.route("/rdrctMain", methods=["GET", "POST"])
def rdrctMain():
    return jsonify({"message":"euge", "redirect":"/main"})

@app.route("/main")
def main():
    global user
    global passw_encd
    conn = sqlite3.connect("userdata.db")
    curr = conn.cursor()
    sets = json.loads(curr.execute("SELECT sets FROM userdata WHERE (username, password) = (?,?)", (user, passw_encd)).fetchone()[0])
    return render_template("main.html", username=str(user), setsJson=sets)

@app.route("/create", methods=["GET", "POST"])
def create():
    return jsonify({"redirect":"/rdrctCreate"})

@app.route("/rdrctCreate")
def rdrctCreate():
    return render_template("create.html")

@app.route("/generate", methods=["POST", "GET"])
def generate():
    if not request.json:
        print("no json found")
        return jsonify({"message":"eheu"})
    elif "data" not in request.json:
        print("no data found")
        return jsonify({"message":"eheu"})
    else:
        global user
        global passw_encd
        notes = request.json["data"][0]
        number = request.json["data"][1]
        name = request.json["data"][2]
        pfp = request.json["data"][3]
        desc = request.json["data"][4]
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f'Generate ${number} multiple choice questions from the following text: ${notes} in the following format:\
            Three string arrays\
            First array: Each question as a string\
            Second array: All four answers for each question in their own array  \
            Third array: Each correct answer as a string\
            Example:\
                Unformatted: \
                    What color is the sky? \
                        a. Blue\
                        b. White\
                        c. Rainbow\
                        d. Yellow and purple simultaneously\
                    Correct answer: a\
                    What animal says meow? \
                        a. Dog\
                        b. Cat\
                        c. Red lipped batfish\
                        d. Nyan nyan Rui da nyan\
                    Correct answer: b\
                Formatted:\
                ["What color is the sky?", "What animal says meow?"]\
                [["a. Blue", "b. White", "c. Rainbow", "d. Yellow and purple simultaneously"], ["a. Dog", "b. Cat", "c. Red lipped batfish", "d. Nyan nyan Rui da nyan"]]\
                ["a", "b"]\
            Follow this format for each question. Return only the three arrays with no additional text. Do NOT use newlines.\
                Separate each of the three arrays array with "!SEPARATE!" (without the quotation marks).\
        ')
        set = response.text.split("!SEPARATE!")
        set.insert(0, name)
        set.insert(4, pfp)
        set.insert(4, desc)
        conn = sqlite3.connect("userdata.db")
        curr = conn.cursor()
        sets = json.loads(curr.execute("SELECT sets FROM userdata WHERE (username, password) = (?,?)", (user, passw_encd)).fetchone()[0])
        fullset = set[0] + "\n" + set[1] + "\n" + set[2] + "\n" + set[3] + "\n" + set[4] + "\n" + set[5]
        sets.insert(0, fullset)
        sets = json.dumps(sets)
        curr.execute("UPDATE userdata SET sets=? WHERE (username, password) = (?,?)", (sets, user, passw_encd))
        conn.commit()
        conn.close()
        return jsonify({"message":"euge", "questions":sets, "redirect":"/main"})
    
testset = ""

@app.route("/testset", methods=["POST", "GET"])
def testSet():
    if not request.json:
        print("no request")
        return jsonify({"message":"eheu!"}) 
    elif "data" not in request.json:
        print("no data in json request")
        return jsonify({"message":"eheu!"})
    else:
        global testset
        testset = request.json["data"]
        return jsonify({"message":"euge", "redirect":"/rdrctSet"})
        
@app.route("/rdrctSet", methods=["POST", "GET"])
def rdrctSet():
    global testset
    return render_template("test.html", testset=testset)

@app.route("/explain", methods=["POST", "GET"])
def explain():
    if not request.json:
        print("no json found")
        return jsonify({"message":"eheu"})
    elif "data" not in request.json:
        print("data not in json")
        return jsonify({"message":"eheu"})
    else:
        question = request.json["data"][0]
        right = request.json["data"][1]
        wrong = request.json["data"][2]
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f'Write a short 3-4 sentence explanation on why the answer to the question {question} is {right} and not {wrong}. Text only, no astericks (*) should be in the response.')
        return jsonify({"message":"euge", "explanation":response.text})
    
@app.route("/settings", methods=["POST", "GET"])
def settings():
    if not request.json:
        print("no json found")
        return jsonify({"message":"eheu"})
    elif "data" not in request.json:
        print("data not in json")
        return jsonify({"message":"eheu"})
    else:
        global testset
        testset = request.json["data"]
        return jsonify({"message":"euge", "redirect":"/rdrctSettings"})
    
@app.route("/rdrctSettings", methods=["GET", "POST"])
def rdrctSettings():
    global testset
    return render_template("setinfo.html", testset=testset)

@app.route("/dltSet", methods=["POST", "GET"])
def dltSet():
    if not request.json:
        print("no json request")
        return jsonify({"message":"eheu"})
    elif "data" not in request.json:
        print("no data found")
        return jsonify({"message":"eheu"})
    else:
        global testset
        global user
        global passw_encd
        conn = sqlite3.connect("userdata.db")
        curr = conn.cursor()
        set = request.json["data"]
        allsets = json.loads(curr.execute("SELECT sets FROM userdata WHERE (username, password)=(?,?)", (user, passw_encd)).fetchone()[0])
        dltedSet = set[0] + '\n' + set[1] + '\n' + set[2] + '\n' + set[3] + '\n' + set[4] + '\n' + set[5]
        #r"\n".join(request.json["data"])
        for i in allsets:
            if dltedSet in i:
                allsets.remove(i)
        
        allsets = json.dumps(allsets)
        curr.execute("UPDATE userdata SET sets=? WHERE (username, password) = (?,?)", (allsets, user, passw_encd))
        conn.commit()
        conn.close()
        return jsonify({"message":"euge", "redirect":"/main"})
    
app.run(host="0.0.0.0", port=8080, debug=True)
