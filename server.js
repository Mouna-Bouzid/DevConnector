const express=require('express')
const app=express();
const connectDB= require('./config/connectDB')
const PORT= process.env.PORT || 5000

//connect database
connectDB();

//init Middleware
app.use(express.json({ extended: false }))

app.get('/',(req,res)=>(
    res.send('API running')
)) 

//define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))


app.listen(PORT, ()=>
console.log(`Server is running on ${PORT}`) 
)
 