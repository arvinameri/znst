// static/js/assistant.js

// Helper function to get the CSRF token from cookies for Django security
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const assistantButton = document.getElementById("ai-assistant-button");
  const assistantWindow = document.getElementById("ai-assistant-window");
  const closeAssistantBtn = document.getElementById("close-assistant-btn");
  const assistantForm = document.getElementById("assistant-form");
  const assistantInput = document.getElementById("assistant-input");
  const assistantBody = document.getElementById("assistant-body");
  const typingIndicator = document.getElementById("typing-indicator");
  const assistantTitle = document.getElementById("assistant-title");
  const assistantWelcomeMsg = document.getElementById("assistant-welcome-msg");

  // --- Translations for the Assistant ---
  const assistantTranslations = {
    en: {
      title: "Personal Assistant",
      welcome: "Hi! How can I help you?",
      placeholder: "Ask your question...",
      error: "Sorry, I'm having trouble connecting right now.",
    },
    ar: {
      title: "المساعد الشخصي",
      welcome: "مرحباً! كيف يمكنني المساعدة؟",
      placeholder: "اطرح سؤالك...",
      error: "عذراً، أواجه مشكلة في الاتصال الآن.",
    },
    fa: {
      title: "دستیار شخصی",
      welcome: "سلام! چطور می‌توانم کمک کنم؟",
      placeholder: "سوال خود را بپرسید...",
      error: "متاسفانه در حال حاضر امکان اتصال وجود ندارد.",
    },
    zh: {
      title: "个人助理",
      welcome: "你好！我该如何帮助你？",
      placeholder: "问你的问题...",
      error: "抱歉，我现在连接时遇到问题。",
    },
    es: {
      title: "Asistente Personal",
      welcome: "¡Hola! ¿Cómo puedo ayudarte?",
      placeholder: "Haz tu pregunta...",
      error:
        "Lo siento, estoy teniendo problemas para conectarme en este momento.",
    },
    ru: {
      title: "Личный ассистент",
      welcome: "Привет! Чем могу помочь?",
      placeholder: "Задайте ваш вопрос...",
      error: "Извините, у меня проблемы с подключением.",
    },
    tr: {
      title: "Kişisel Asistan",
      welcome: "Merhaba! Nasıl yardımcı olabilirim?",
      placeholder: "Sorunuzu sorun...",
      error: "Üzgünüm, şu anda bağlantı kurmakta zorlanıyorum.",
    },
  };

  let currentAssistantLang = "fa";

  // --- Functions ---
  function openAssistant() {
    assistantWindow.classList.remove("hidden");
  }
  function closeAssistant() {
    assistantWindow.classList.add("hidden");
  }
  function scrollToBottom() {
    assistantBody.scrollTop = assistantBody.scrollHeight;
  }

  function addUserMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "user-message");
    messageElement.innerHTML = `<p>${message}</p>`;
    assistantBody.insertBefore(messageElement, typingIndicator);
    scrollToBottom();
  }

  function addBotMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "bot-message");
    messageElement.innerHTML = `<p>${message}</p>`;
    assistantBody.insertBefore(messageElement, typingIndicator);
    scrollToBottom();
  }

  window.updateAssistantLanguage = function (lang) {
    if (!assistantTranslations[lang]) lang = "fa"; // Default to Persian
    currentAssistantLang = lang;
    const t = assistantTranslations[lang];
    assistantTitle.innerText = t.title;
    assistantWelcomeMsg.innerText = t.welcome;
    assistantInput.placeholder = t.placeholder;
  };

  // --- Event Listeners ---
  assistantButton.addEventListener("click", openAssistant);
  closeAssistantBtn.addEventListener("click", closeAssistant);

  assistantForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userInput = assistantInput.value.trim();

    if (userInput) {
      addUserMessage(userInput);
      assistantInput.value = "";
      typingIndicator.classList.remove("hidden");
      scrollToBottom();

      try {
        const response = await fetch("/api/ask_ai/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ question: userInput }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const data = await response.json();
        addBotMessage(data.answer);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMsg = assistantTranslations[currentAssistantLang].error;
        addBotMessage(errorMsg);
      } finally {
        typingIndicator.classList.add("hidden");
        scrollToBottom();
      }
    }
  });

  // Initialize with default language
  updateAssistantLanguage(currentAssistantLang);
});
