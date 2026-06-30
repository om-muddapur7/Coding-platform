import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

//redis connection
import { createClient } from "redis"
import { prisma } from "./db";
import { SubmissionStatus } from "./generated/prisma/enums";

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
    const {code, language} = req.body;

    const response = await prisma.submissions.create({
        data: {
            code, 
            language,
            status: "Processing"
        }
    })

    client.lPush("problems", JSON.stringify({submissionId: response.id, code, language}));

    res.json({
        message: "processing",
        id: response.id
    })
})

//get results
app.get("/submission/:submissionId", async (req, res) => {
    const response = await prisma.submissions.findFirst({
        where: {
            id: req.params.submissionId
        }
    });

    res.json({
        submission: response
    })
})

app.listen(3000);