from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from openai import AsyncOpenAI
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

app = FastAPI()
oai_client = AsyncOpenAI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
Your task is to determine the probability for a given text from a webpage to be a clickbait.
I will provide you with the title and the content of the webpage.
You will need to provide me with the probability that the content is clickbait.

Follow the instructions below to complete the task:
- Read the title and the content of the webpage.
- Provide the probability that the content is clickbait.
- The probability should be a value between 0 and 9.
- Your answer SHOULD BE ONLY A NUMBER FROM 0 to 9. DON'T INCLUDE ANY OTHER SYMBOLS OR CHARACTERS, ONLY THE NUMBER.
- Use 0 for "Not Clickbait" and 9 for "Very Clickbait".
"""

USER_PROMPT_TEMPLATE = """
Page Title:
{title}

Page Content: 
{text}
"""


class PageInformation(BaseModel):
    title: str
    text: str


@app.post("/prob-by-page")
async def compute_prob_by_page(request: PageInformation):
    chat_completion = await oai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": USER_PROMPT_TEMPLATE.format(
                    title=request.title, text=request.text
                ),
            },
        ],
        logprobs=True,
        top_logprobs=5,
    )

    # Compute the weighted average of the top 10 logprobs
    logprobs = chat_completion.choices[0].logprobs.content[0].top_logprobs
    avg = 0

    for logprob in logprobs:
        prob = np.exp(logprob.logprob)
        avg += prob * float(logprob.token)

    return {"probability": np.round(avg, 2) / 9}


# To run the app, use uvicorn
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
