import "./index.css";
import { Button } from "./components/ui/button";
import axios from "axios";
import { useRef, useState } from "react";

const BACKEND_URL = "http://localhost:8000"

export function App() {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [status, setStatus] = useState("");
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedlanguage] = useState("c++");

  async function pollBackend(submissionId: string) {
    const response = await axios.get(`${BACKEND_URL}/submission/${submissionId}`);

    if(response.data.submission.status !== "Processing"){
      setStatus(response.data.submission.status);
      setOutput(response.data.submission.output);
    } else {
      await new Promise(r => setTimeout(r, 3000));
      return pollBackend(submissionId);
    }
  }

	return (
		<div className="h-screen w-screen flex">
			<div className="flex-1 h-screen bg-red-300">
				<div className="flex items-center justify-between p-2">
					<div className="flex items-center gap-5">
						<Button variant={selectedLanguage === "c++" ? "destructive" : "outline"} onClick={() => setSelectedlanguage("c++")}>C++</Button>

						<Button variant={selectedLanguage === "js" ? "destructive" : "outline"} onClick={() => setSelectedlanguage("js")}>JS</Button>
            
						<Button variant={selectedLanguage === "py" ? "destructive" : "outline"} onClick={() => setSelectedlanguage("py")}>Python</Button>
					</div>

					<div>
						<Button onClick={async() => {
              setStatus("Processing");
              setOutput("");

              const response = await axios.post(`${BACKEND_URL}/submission`, {
                "code": textAreaRef.current!.value,
                "language": selectedLanguage
              });

              await pollBackend(response.data.id);
            }} >Submit</Button>
					</div>
				</div>

				<textarea
					name=""
					id=""
					className="w-180 h-160 border border-black bg-accent-foreground text-amber-50 rounded-2xl m-4 p-4 "
					rows={10}
          ref={textAreaRef}
				></textarea>
			</div>

			<div className="flex-1 h-screen bg-green-300">
        <div>
          Status : {status}
        </div>

        <div>
          Output : {output}
        </div>

      </div>
		</div>
	);
}

export default App;
