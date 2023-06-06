const express = require("express")
const app = express()
const db = require("./db.json")
const multer = require("multer")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const cors = require("cors")

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
  
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  })

const upload = multer({ storage: storage })


app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.static("uploads"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:8080'
}))

app.get("/", (req, res) => {
    return res.render("index", {items : db.public.items})
})

app.get("/outfit", (req, res) => {
    const outfits = getOutfitsWithTemperatrue(req.query.temperature)

    console.log(outfits)

    return res.render("outfit", {outfits})
})

app.get("/temperature", (req, res) => {
    return res.render("temperature")
})

app.get("/add", (req, res) => {
    return res.render("add")
})

app.post("/add", upload.single("img"), (req, res) => {
    db.public.items.push({
        img : req.file.destination + req.file.filename,
        ...req.body
    })

    const updatedData = JSON.stringify(db);

    fs.writeFileSync('./db.json', updatedData);

    return res.send("good")
})

app.listen(8080, () => {
    console.log("server listening on 8080")
})

function getOutfitsWithTemperatrue(temperature){
    const temp = {
        상의 : [],
        하의 : [],
        신발 : [],
    }

    const result = {
        'top' : undefined,
        'bottom' : undefined,
        'shoes' : undefined,
    }

    db.public.items.forEach(item => {
        if(temperature >= 23){
            if(["반바지", "짧은치마", "반팔티", "반팔셔츠"].includes(item.category)){
                temp[item.type].push(item)
            }
        }else if (temperature>=17){
            if(["면바지", "긴팔", "맨투맨", "후드티", "가디건"].includes(item.category)){
                temp[item.type].push(item)
            }
        }else if (temperature >=9){
            if(["환절기자켓", "환절기코트", "청바지", "청바지"].includes(item.category)){
                temp[item.type].push(item)
            }
        }else{
            if(["가죽자켓", "겨울코트", "패딩", "청바지"].includes(item.category)){
                temp[item.type].push(item)
            }
        }

        if(item.type=="신발"){
            temp["신발"].push(item)
        }
    })

    
    result.top = temp.상의[generateRandomInt(temp.상의.length)]
    result.bottom = temp.하의[generateRandomInt(temp.하의.length)]
    result.shoes = temp.신발[generateRandomInt(temp.신발.length)]

    return result
}

function generateRandomInt(max){
    return Math.floor(Math.random() * max)
}