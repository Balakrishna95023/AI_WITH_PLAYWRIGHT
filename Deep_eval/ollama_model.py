from deepeval.models import DeepEvalBaseLLM
import ollama


class OllamaModel(DeepEvalBaseLLM):

    def __init__(self, model_name):
        self.model_name = model_name


    def load_model(self):
        return self.model_name


    def generate(self, prompt: str) -> str:

        response = ollama.chat(
            model=self.model_name,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        print(response["message"]["content"])
        return response["message"]["content"]


    async def a_generate(self, prompt: str) -> str:

        return self.generate(prompt)


    def get_model_name(self):
        return self.model_name