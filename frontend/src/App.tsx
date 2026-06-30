import "./index.css";
import { Button } from "./components/ui/button";
import axios from "axios";
import { useRef, useState } from "react";

const BACKEND_URL = "http://localhost:8000";

export function App() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const [status, setStatus] = useState("");
	const [output, setOutput] = useState("");
	const [selectedLanguage, setSelectedlanguage] = useState("c++");

	async function pollBackend(submissionId: string) {
		const response = await axios.get(
			`${BACKEND_URL}/submission/${submissionId}`,
		);

		if (response.data.submission.status !== "Processing") {
			setStatus(response.data.submission.status);
			setOutput(response.data.submission.output);
		} else {
			await new Promise((r) => setTimeout(r, 3000));
			return pollBackend(submissionId);
		}
	}

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="mx-auto max-w-7xl">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Online Code Runner
				</h1>

				<div className="grid grid-cols-2 gap-6">
					{/* Code Editor */}
					<div className="bg-white rounded-xl shadow-lg border">
						<div className="flex items-center justify-between border-b px-5 py-4">
							<div>
								<h2 className="text-xl font-semibold">Code Editor</h2>
								<p className="text-sm text-gray-500">
									Write your solution below
								</p>
							</div>

							<div className="flex gap-2">
								<Button
									variant={selectedLanguage === "c++" ? "default" : "outline"}
									onClick={() => setSelectedlanguage("c++")}
								>
									C++
								</Button>

								<Button
									variant={selectedLanguage === "js" ? "default" : "outline"}
									onClick={() => setSelectedlanguage("js")}
								>
									JavaScript
								</Button>

								<Button
									variant={selectedLanguage === "py" ? "default" : "outline"}
									onClick={() => setSelectedlanguage("py")}
								>
									Python
								</Button>
							</div>
						</div>

						<textarea
							ref={textAreaRef}
							spellCheck={false}
							className="w-full h-[650px] p-5 resize-none outline-none font-mono text-sm bg-gray-50"
							placeholder="// Write your code here..."
						/>

						<div className="flex justify-end p-5 border-t">
							<Button
								onClick={async () => {
									setStatus("Processing");
									setOutput("");

									const response = await axios.post(
										`${BACKEND_URL}/submission`,
										{
											code: textAreaRef.current!.value,
											language: selectedLanguage,
										},
									);

									await pollBackend(response.data.id);
								}}
							>
								▶ Run Code
							</Button>
						</div>
					</div>

					{/* Terminal */}
					<div className="bg-white rounded-xl shadow-lg border flex flex-col">
						<div className="border-b px-5 py-4">
							<h2 className="text-xl font-semibold">Console / Terminal</h2>
							<p className="text-sm text-gray-500">Program execution result</p>
						</div>

						<div className="p-5">
							<div className="mb-5">
								<span className="font-semibold">Status :</span>

								<span
									className={`ml-3 rounded-full px-3 py-1 text-sm font-medium ${
										status === "Success"
											? "bg-green-100 text-green-700"
											: status === "Failure"
												? "bg-red-100 text-red-700"
												: "bg-yellow-100 text-yellow-700"
									}`}
								>
									{status || "Idle"}
								</span>
							</div>

							<div>
								<div className="font-semibold mb-2">Output</div>

								<pre className="bg-black text-green-400 rounded-lg p-4 h-[560px] overflow-auto font-mono text-sm whitespace-pre-wrap">
									{output || "Your program output will appear here..."}
								</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
