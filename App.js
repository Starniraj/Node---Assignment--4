const express=require("express")
const Checking= require("./Routes/Checking")//importing

const app=express()

app.use(express.json())

app.use("/auth",Checking)//linking child with parent-Checking

app.get("/",function (req,res) {
    console.log('hi')
    
})




app.listen(9090,()=>{
    console.log('server running')
})