const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const fetch=require('node-fetch')
const app=express()
app.use(cors({origin:'*'}))
app.use(bodyParser.json())
require('dotenv').config()
const API_KEY=process.env.GROQ_API_KEY
app.post('/explain',async (req,res)=>{
    const code=req.body?.code
    if(!code) return res.status(400).json({error:'Missing "code" in request body.'})
    try{
        const response=await fetch("http://api.groq.com/openai/v1/chat/completions",{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${API_KEY}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                model:'llama3-8b-8192',
                messages:[
                    {
                        role:'system',
                        content:'You are a helpful assistant that explains what code snippets do.'
                    },
                    {
                        role:'user',
                        content:`Explain this code: \n\n${code}`
                    }
                ]
            })
        })
        const data=await response.json()
        const explanation=data.choices?.[0]?.message?.content||'No explanantion received'
        res.json({explanation})
    }catch(err){
        console.error('Groq API error:',err)
        res.status(500).json({explanation:'Groq API error.'})
    }
})
app.listen(3000,()=>{
    console.log('Code Lens backend running on port 3000 (Groq-powered)')
})  