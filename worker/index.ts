//redis connection
import { createClient } from "redis";
import fs from "fs";
import { spawn } from "child_process";

const client = createClient({
  url: "rediss://default:gQAAAAAAAl6MAAIgcDEwNTUzNmQxYzk5ZjA0NGU1ODJjMjE0MmE4ZGM1MjZmYg@fun-koi-155276.upstash.io:6379"
});

client.on("error", function(err) {
  throw err;
});
await client.connect()
await client.set('foo','bar');

const worker = async() => {
    while(1) {        
        const response = await client.rPop("problems");
        if(!response){
            await new Promise((r) => setTimeout(r, 1000));
            continue;
        }

        const parsedResponse = JSON.parse(response);
        const code = parsedResponse.code;
        const language = parsedResponse.language;

        console.log("Processing user question for user " + parsedResponse.userId);
        

        if(language === "c++"){
            console.log("Running user c++ code");
            const filePath = __dirname + "/code/a.cpp";
            fs.writeFileSync(filePath, code);

            //sandboxing
            spawn("g++", [filePath, "-o", "./code/out"]);
            await new Promise((r) => setTimeout(r, 2000));

            const response = spawn("./code/out");
            response.stdout.on("data", (chunk) => {
                console.log(chunk.toString());
                
            })
        }

        if(language === "js"){
            //run code
            const filePath = __dirname + "/code/a.js";
            console.log("Running user js code");
            fs.writeFileSync(filePath, code);
            spawn("node", [filePath])

            const response = spawn("node", [filePath]);
            response.stdout.on("data", (chunk) => {
                console.log(chunk.toString());
                
            })

        }

        if(language === "py"){
            //run code
            const filePath = __dirname + "/code/a.py";
            console.log("Running user py code");
            fs.writeFileSync(filePath, code);
            spawn("python", [filePath])

            const response = spawn("python", [filePath]);
            response.stdout.on("data", (chunk) => {
                console.log(chunk.toString());
                
            })

        }
    }
}

worker();