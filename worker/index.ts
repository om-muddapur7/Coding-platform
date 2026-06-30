//redis connection
import { createClient } from "redis";
import fs from "fs";
import { spawn } from "child_process";
import { prisma } from "./db";

const client = createClient({
	url: "rediss://default:gQAAAAAAAl6MAAIgcDEwNTUzNmQxYzk5ZjA0NGU1ODJjMjE0MmE4ZGM1MjZmYg@fun-koi-155276.upstash.io:6379",
});

client.on("error", function (err) {
	throw err;
});
await client.connect();
await client.set("foo", "bar");

const worker = async () => {
	while (1) {
		const response = await client.rPop("problems");
		if (!response) {
			await new Promise((r) => setTimeout(r, 1000));
			continue;
		}

		const parsedResponse = JSON.parse(response);
		const code = parsedResponse.code;
		const language = parsedResponse.language;
		const submissionId = parsedResponse.submissionId;

		console.log("Processing user question for user " + parsedResponse.userId);

		let finalOutput = "";

		if (language === "c++") {
			console.log("Running user c++ code");

			const filePath = __dirname + "/code/a.cpp";
			const outputPath = __dirname + "/code/out";

			fs.writeFileSync(filePath, code);

			// Compile
			const compiler = spawn("g++", [filePath, "-o", outputPath]);

			let compileError = "";

			compiler.stderr.on("data", (chunk) => {
				compileError += chunk.toString();
			});

			// Wait for compilation to finish
			const compileExitCode = await new Promise<number>((resolve) => {
				compiler.on("exit", (code) => {
					resolve(code ?? 1);
				});
			});

			// Compilation failed
			if (compileExitCode !== 0) {
				await prisma.submissions.update({
					where: {
						id: submissionId,
					},
					data: {
						status: "Failure",
						output: compileError,
					},
				});

				continue;
			}

			// Run executable
			const program = spawn(outputPath);

			let runtimeError = "";

			program.stdout.on("data", (chunk) => {
				finalOutput += chunk.toString();
			});

			program.stderr.on("data", (chunk) => {
				runtimeError += chunk.toString();
			});

			// Wait for execution
			const runExitCode = await new Promise<number>((resolve) => {
				program.on("exit", (code) => {
					resolve(code ?? 1);
				});
			});

			if (runExitCode === 0) {
				await prisma.submissions.update({
					where: {
						id: submissionId,
					},
					data: {
						status: "Success",
						output: finalOutput.trim(),
					},
				});
			} else {
				await prisma.submissions.update({
					where: {
						id: submissionId,
					},
					data: {
						status: "Failure",
						output: runtimeError,
					},
				});
			}
		}

		if (language === "js") {
			//run code
			const filePath = __dirname + "/code/a.js";
			console.log("Running user js code");
			fs.writeFileSync(filePath, code);
			spawn("node", [filePath]);

			const response = spawn("node", [filePath]);
			response.stdout.on("data", (chunk) => {
				finalOutput += chunk.toString();
			});

			//update db
			await new Promise<void>((resolve) => {
				response.on("exit", async () => {
					await prisma.submissions.update({
						where: {
							id: submissionId,
						},
						data: {
							status: "Success",
							output: finalOutput,
						},
					});
					resolve();
				});
			});
		}

		if (language === "py") {
			//run code
			const filePath = __dirname + "/code/a.py";
			console.log("Running user py code");
			fs.writeFileSync(filePath, code);
			spawn("python", [filePath]);

			const response = spawn("python", [filePath]);
			response.stdout.on("data", (chunk) => {
				finalOutput += chunk.toString();
			});

			//update db
			await new Promise<void>((resolve) => {
				response.on("exit", async () => {
					await prisma.submissions.update({
						where: {
							id: submissionId,
						},
						data: {
							status: "Success",
							output: finalOutput,
						},
					});
					resolve();
				});
			});
		}
	}
};

worker();
