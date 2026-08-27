require("dotenv").config();

async function warmupOllama() {
    if (!process.env.AI_URL || !process.env.AI_MODEL) {
        console.log("AI model not configured, skipping warmup...");
    }
    else{
        const response = await fetch(process.env.AI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: process.env.AI_MODEL,
                messages: [
                    {
                        role: "user",
                        content: "hi",
                    },
                ],
                stream: false,
                think: false,
                keep_alive: "1h",
            }),
        });
    
        if (!response.ok) {
            throw new Error(`Ollama warmup failed: ${response.status}`);
        }
    
        await response.json();
    
        console.log("Ollama model loaded and kept alive for 1 hour");
    }

}

warmupOllama();