const http= require("http");
const app= require("../app");
const debug=require("debug")("library-website:server")

//get port from enviroment and store in express
const port= normalizePort(process.env.Port || "8000");
app.set("port", port);

//create  http server
const server= http.createServer(app);
//listen of provided port

server.listen(port);
server.on("error", onError);
server.on("listening", onListening)

//normalize port into a string, a number or false 
function normalizePort(val){
    let port = parseInt(val, 10);
//named port
    if(isNaN(port)){
        return val
    }else{
        return port;
    }

    return false;
}


//handle server error incase
function onError(error){
    if(syscall!=="listen"){
        throw error;
    }
    else{
        //handle specific listening errors
        var bind= typeof port==="string"? 
        "pipe"+ port:
        "port"+  port

        switch(error.code){
            case EACCESS:
             console.log(bind+ "you are trying to access invalid memory");
            process.exit(1)
            break;
            case EADDRINUSE:
                console.log(bind+ "the port is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }



    }
}
 function onListening(){
     var addr=server.address();
     var bind= typeof addr ==="string"?
     "pipe"+ addr:
     "port "+ addr.port
     console.log("listening on " + bind) 
     debug("listening on" + bind);
    }