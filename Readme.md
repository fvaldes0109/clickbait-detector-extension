# Clickbait Detector Web Extension

A web extension that predicts whether a news article is clickbait or not. The extension uses a machine learning model to predict the clickbait score of the article based on its title and content.

## Installation and usage

You can install the extension locally by going to the extensions settings in your browser and enabling developer mode. Then load the extension by selecting the `extension` folder in the repository. Once the extension is installed, you can use it by clicking on the extension icon in the browser toolbar. The extension will analyze the title and content of the current page and display the clickbait score.

To use the server you can create a Python virtual environment and install the required packages using the following commands:

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

You can then start the server by running the following command:

```bash
uvicorn main:app --reload
```
