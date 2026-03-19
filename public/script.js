const startBtn = document.getElementById("startBtn");
const speakBtn = document.getElementById("speakBtn");
const chatDiv = document.getElementById("chat");

let history = [];

// Text-to-Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// Speech-to-Text
function listen() {
  return new Promise((resolve) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();

    recognition.onresult = (event) => {
      resolve(event.results[0][0].transcript);
    };
  });
}

// Start Call
startBtn.onclick = async () => {
  const firstMessage = "Hi, are you interested in our product?";
  
  addMessage("AI", firstMessage);
  speak(firstMessage);

  history.push({ role: "assistant", content: firstMessage });
};

// Speak Button
speakBtn.onclick = async () => {
  const userSpeech = await listen();

  addMessage("You", userSpeech);

  history.push({ role: "user", content: userSpeech });

  const res = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: userSpeech,
      history
    })
  });

  const data = await res.json();

  addMessage("AI", data.reply);
  speak(data.reply);

  history.push({ role: "assistant", content: data.reply });
};

// UI
function addMessage(sender, text) {
  const p = document.createElement("p");
  p.innerHTML = `<b>${sender}:</b> ${text}`;
  chatDiv.appendChild(p);
}