const express = require('express')
const shortId = require("shortid")
const createHttpError = require("http-errors")
const mongoose = require("mongoose")
const path = require("path")

const ShortUrl = require("./models/url.model")
const app = express()


app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

mongoose.connect("mongodb+srv://mehra1024:2JPNdjUjzPBA0abc@cluster0.m18dy.mongodb.net/urlSoartner").then(()=>console.log("mongoose connetd")).catch((erro)=>console.log("eoor"))


app.set("view engine","ejs")
app.get("/",(req,res,next)=>{
    res.render("index")
})

app.post("/" ,async(req,res,next)=>{
    try {
        const {url} = req.body
        if(!url)
        {
            throw createHttpError.BadRequest("Enter url")
        }
        const UrlExist = await ShortUrl.findOne({url})
        if(UrlExist)
        {
            res.render("index", {short_url:`http://localhost:3000/${UrlExist.shortId}`})
            return
        }
        const shortUrl = new ShortUrl({url:url,shortId:shortId.generate()})
        const result = await shortUrl.save()
        res.render("index", {short_url:`http://localhost:3000/${result.shortId}`})

    } catch (error) {
        next(error)
    }
})

app.get("/:shortId", async(req,res,next)=>{
    try {
    const {shortId} =  req.params
    const result = await ShortUrl.findOne({shortId})
    if(!result)
    {
        throw createHttpError.NotFound("url done not exits")
    }
    res.redirect(result.url)
    }
     catch (error) { 
        next(error)
    }
})

app.use((req,res,next)=>{
    next(createHttpError.NotFound())
})
app.use((err,req,res,next)=>{
    res.status(err.status||500)
    res.render("index",{error:err.message})
})
app.listen(3000,()=>
console.log("start")
)