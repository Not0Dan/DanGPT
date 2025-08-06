# DanGPT
# Make sure you have the following installed:

- Node.js (v16+ recommended)

- npm

- Ollama (installed and running locally)

- (Optional) Ngrok for tunneling ****still working on this

## Setup Instructions
1. Clone the Repository

2. Ollama Setup
* Make sure Ollama is installed and running on your system.

* Pull the required model if you haven’t already:

* ollama pull llama3

* Ensure Ollama is running locally:

* ollama run llama3

## 3. Backend Setup (Express + Ollama)
* cd ../dangpt-server
* npm install
### Create .env file in backend/:

PORT=5000

OLLAMA_MODEL=llama3:8b (or whatever model you choose to use)

AUTH_TOKEN=your_secret_token

### Start the backend server:

* node index.js

## 4. Frontend Setup (React)

* cd ../dangpt-client

* npm install

###Create .env file in frontend/:

REACT_APP_API_URL=http://localhost:5000

REACT_APP_AUTH_TOKEN=your_secret_token

### Start the React app:

* npm start
