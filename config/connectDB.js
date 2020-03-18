const mongoose= require ('mongoose')
const config= require("config")
const DB=config.get('mongoURI')

// mongoose.connect(DB)
// .then(()=> console.log("mongoose connected"))
// .catch((err)=> console.log(Error))

const connectDB = async () => {

try{
await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false });
console.log("mongoDB is connected...")
} catch(err){
 console.error(err.message)   
 //exit process failure
 process.exit(1)
}

}

module.exports = connectDB;