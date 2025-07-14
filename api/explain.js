const fetch=require('node-fetch')
export default async function handler(req,res){
    if(req.method!=='POST') return res.status(405).json({error:'Only POST allowed'})
    const code=req.body?.code
    if(!code) return res.status(400).json({error:'Missing code'})
    const prompt=`Explain what this code does:\n\n${code}`
    try{
        const response=await fetch('http://api.groq.com/openai/v1/chat/completions',{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                model:'llama3-8b-8192',
                messages:[
                    {role:'system',content:'You explain code snippets clearly.'},
                    {role:'user',content:prompt}
                ]
            })
        })
        const data=await response.json()
        const explanation=data.choices?.[0]?.message?.content||'No explanation'
        return res.status(200).json({explanation})
    }catch(err){
        console.error('Groq API error:',err)
        return res.status(500).json({error:'Failed to fetch explanation'})
    }
}