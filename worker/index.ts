//redis connection
import { createClient } from "redis"

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
            await new Promise((r) => setTimeout(r, 10000));
        }

        if(language === "js"){
            console.log("Running user js code");
            await new Promise((r) => setTimeout(r, 2000));
        }
    }
}

worker();