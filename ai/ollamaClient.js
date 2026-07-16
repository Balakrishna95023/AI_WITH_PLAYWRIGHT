export async function askAI(prompt) {

    const response = await fetch(
        "http://localhost:11434/api/generate",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                model:"llama3.2:3b",
                prompt,
                format:"json",
                stream:false
            })
        }
    );


    const result = await response.json();

    return JSON.parse(result.response);
}