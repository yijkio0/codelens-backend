const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const fetch=require('node-fetch')
const app=express()
app.use(cors({origin:'*'}))
app.use(bodyParser.json())
app.post('/explain',async (req,res)=>{
    const code=req.body?.code
    if(!code) return res.status(400).json({error:'Missing "code" in request body.'})
    const prompt=`Explain what this code does:\n\n${code}`
    try{
        const response=await fetch("http://localhost:11434/api/generate",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                model:'codellama',
                prompt,
                stream:false
            })
        })
        const data=await response.json()
        res.json({explanation:data.response})
    }catch(err){
        console.error('Local LLM error:',err)
        res.status(500).json({explanation:'⚠️ Local LLM error.'})
    }
})
app.listen(3000,()=>{
    console.log('LLM server running')
})  