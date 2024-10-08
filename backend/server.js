const express = require('express')
const app = express()
require('dotenv').config()

const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {dbConnect} = require('./utils/db')
const socket = require('socket.io')
const http = require('http')
const server =  http.createServer(app)
app.use(cors({
    origin:['http://localhost:3000','http://localhost:3001'],
    credentials:true
}))

const io = socket(server,{
    cors:{
        origin:"*",
        credentials:true
    }
})

var allCustomer =[] ;
const addUser = (customerId,socketId,userInfo) =>{
    const checkUser = allCustomer.some(u=>u.customerId==customerId);
    if(!checkUser){
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        })
    }
   

}

var allSellers =[] ;
const addSeller = (sellerId,socketId,userInfo) =>{
    const checkUser = allSellers.some(u=>u.sellerId==sellerId           );
    if(!checkUser){
        allSellers.push({
            sellerId,
            socketId,
            userInfo
        })
    }
   

}

const findCustomer = (customerId) =>{
    return allCustomer.find(customer =>customer.customerId==customerId);
}

const findSeller = (sellerId) =>{
    return allSellers.find(seller =>seller.sellerId==sellerId);
}

const remove = (socketId) =>{
    allCustomer = allCustomer.filter(c =>c.socketId!=socketId);
    allSellers  = allSellers.filter(c =>c.socketId!=socketId);
}

io.on('connection',(soc)=>{
    console.log("socket server is running");
    soc.on('add_user',(customerId,userInfo)=>{
        addUser(customerId,soc.id,userInfo);
        io.emit('activeSeller',allSellers)
    })
    soc.on('add_seller',(sellerId,userInfo)=>{
        addSeller(sellerId,soc.id,userInfo);
        console.log(" on seller add",allSellers);
        io.emit('activeSeller',allSellers)
    })

    soc.on('send_seller_message',(msg)=>{
       const customer = findCustomer(msg?.receiverId);
       
       if(customer!==undefined){
        soc.to(customer.socketId).emit('seller_message',msg)
       }
       
    })

    soc.on('send_customer_message',(msg)=>{
        const seller = findSeller(msg?.receiverId);
        consol.log(seller)
        if(seller!==undefined){
         soc.to(seller.socketId).emit('customer_message',msg)
        }
        
     })


     
    soc.on('add_admin',(adminInfo)=>{
        delete adminInfo.email;
        delete adminInfo.password;
        let admin = adminInfo;
        admin.socketId =soc.id;
        console.log(" on admin add ",allSellers);
        io.emit('activeSeller',allSellers)
    })


   
    soc.on('disconnect',()=>{
        console.log("user disconneted") 
        remove(soc.id);
        io.emit('activeSeller',allSellers)
    })

},err=>{
    console.log("socket server not running");
})


app.use(bodyParser.json())
app.use(cookieParser())



app.use('/api',require('./routes/authRoutes'))
app.use('/api',require('./routes/dashboard/categoryRoutes'))
app.use('/api',require('./routes/dashboard/productRoutes'))
app.use('/api',require('./routes/dashboard/sellerRoutes'))
app.use('/api/home/',require('./routes/home/homeRoutes'))
app.use('/api',require('./routes/home/customerAuthRoutes'))
app.use('/api',require('./routes/home/cartRoutes'))
app.use('/api',require('./routes/order/orderRoutes'))
app.use('/api',require('./routes/chatRoutes'))






app.get('/',(req,res)=>res.send("backend running"))

const port = process.env.PORT;
dbConnect();


server.listen(port,()=>console.log(`listening on port ${port}`));