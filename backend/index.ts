import express from "express";


const app = express();
app.use(express.json());

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


//submit code
app.post("/submission", async (req, res) => {
    const {userId, questionId, code, language} = req.body;

    client.lPush("problems", JSON.stringify({userId, questionId, code, language}));

    res.json({
        message: "processing"
    })
})

//get results
app.get("/submission/:submissionId", (req, res) => {

})

app.listen(3000);