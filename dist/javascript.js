// 🔥 Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBhxgNqEpreXaM_T_2I7nkLd0FgChbFOhE",
  authDomain: "quotes091-6ee9d.firebaseapp.com",
  projectId: "quotes091-6ee9d",
  storageBucket: "quotes091-6ee9d.firebasestorage.app",
  messagingSenderId: "658020485494",
  appId: "1:658020485494:web:0dccaaad36574a738d9257",
  measurementId: "G-BR9WZ5T79J"
};

// ✅ Initialize Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db; // keep global

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (navbar) {
    requestAnimationFrame(() => {
      navbar.classList.remove("opacity-0", "-translate-y-2");
    });
  }

  if (menuBtn && mobileMenu) {
    const line1 = menuBtn.querySelector(".line1");
    const line2 = menuBtn.querySelector(".line2");
    const line3 = menuBtn.querySelector(".line3");

    const openMenu = () => {
      line1?.classList.add("translate-y-[6px]", "rotate-45");
      line2?.classList.add("opacity-0");
      line3?.classList.add("-translate-y-[6px]", "-rotate-45");

      mobileMenu.classList.remove("pointer-events-none");
      mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
      mobileMenu.classList.replace("opacity-0", "opacity-100");
      menuBtn.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      line1?.classList.remove("translate-y-[6px]", "rotate-45");
      line2?.classList.remove("opacity-0");
      line3?.classList.remove("-translate-y-[6px]", "-rotate-45");

      mobileMenu.style.maxHeight = "0px";
      mobileMenu.classList.replace("opacity-100", "opacity-0");
      setTimeout(() => mobileMenu.classList.add("pointer-events-none"), 200);
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    const mq = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      if (mq.matches) closeMenu();
    };
    mq.addEventListener("change", handleResize);

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }
});

// ================== QUOTES ==================
const quotesGrid = document.getElementById("quotesGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let quotesData = [];
const itemsPerLoad = 6;
let currentIndex = 0;
let activeCategory = null;

// ✅ Fetch Quotes from Firestore
async function fetchQuotes() {
  try {
    const querySnapshot = await getDocs(collection(window.db, "quotes"));
    quotesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderQuotes();
  } catch (err) {
    console.error("Error fetching quotes from Firestore:", err);
  }
}

// ✅ Render Quotes
function renderQuotes() {
  if (!quotesGrid || !loadMoreBtn) return;

  const filteredData =
    !activeCategory || activeCategory.toLowerCase() === "all"
      ? quotesData
      : quotesData.filter(
          q => String(q.category).toLowerCase() === activeCategory.toLowerCase()
        );

  if (filteredData.length === 0) {
    quotesGrid.innerHTML = `<p class="p-4 text-center text-gray-600">No quotes found for this category.</p>`;
    loadMoreBtn.style.display = "none";
    return;
  }

  // const nextBatch = filteredData.slice(currentIndex, currentIndex + itemsPerLoad);
  // nextBatch.forEach(quoteObj => {
  //   const article = document.createElement("article");
  //   article.className = `
  //     quote-card 
  //     p-5 rounded-xl shadow-md transition-transform duration-200
  //     bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100
  //     hover:shadow-lg hover:-translate-y-1 flex justify-between flex-col gap-3
  //   `;
  //   article.dataset.category = quoteObj.category;

  //   article.innerHTML = `
  //     <h3 class="text-xl font-bold bg-green-400 text-rose-700 my-2 text-center">${quoteObj.category}</h3>
  //     <p class="italic text-gray-700 leading-relaxed py-3 px-4 quote-text" 
  //        data-original="${quoteObj.quote}" 
  //        data-translated="">“${quoteObj.quote}”</p>
  //     <div class="flex flex-col gap-2">
  //       <button class="copy-btn px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-black font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
  //         ❤️ Copy Quote
  //       </button>
  //       <div class="flex gap-2 items-center w-full mx-auto my-auto">
  //         <select class="translate-lang border rounded-lg px-2 py-1 text-gray-700 flex-1">
  //           <option value="hi">Hindi</option>
  //           <option value="en">English</option>
  //           <option value="gu">Gujarati</option>
  //           <option value="ur">Urdu</option>
  //           <option value="es">Spanish</option>
  //           <option value="fr">French</option>
  //           <option value="de">German</option>
  //           <option value="ar">Arabic</option>
  //         </select>
  //         <button class="translate-btn px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
  //           🌍 Translate
  //         </button>
  //       </div>
  //     </div>
  //   `;
  //   quotesGrid.appendChild(article);
  // });
const nextBatch = filteredData.slice(currentIndex, currentIndex + itemsPerLoad);
nextBatch.forEach(quoteObj => {
  const article = document.createElement("article");
  article.className = `
    quote-card 
    p-5 rounded-xl shadow-md transition-transform duration-200
    bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100
    hover:shadow-lg hover:-translate-y-1 flex justify-between flex-col gap-3
  `;
  article.dataset.category = quoteObj.category;

  article.innerHTML = `
    <h3 class="text-lg font-semibold bg-green-200 rounded-b-sm text-rose-700 py-1 px-3 rounded-md text-center">
      ${quoteObj.category}
    </h3>

    <p class="italic text-gray-700 leading-relaxed py-2 px-3 text-center quote-text" 
       data-original="${quoteObj.quote}" 
       data-translated="">
       “${quoteObj.quote}”
    </p>

    <div class="flex flex-col gap-3 items-center mx-3 ">
      <!-- Copy button -->
      <button class="copy-btn flex justify-center items-center p-1 px-3 w-full py-1.5 text-sm bg-gradient-to-r from-pink-500 to-purple-400 text-white font-bold rounded-md shadow hover:shadow-lg hover:scale-105 transition-all">
        ❤️ Copy
      </button>

      <!-- Translate section -->
      <div class="flex gap-2 items-center py-2 justify-center w-full">
        <select class="translate-lang flex shadow-sm border rounded-md px-2 py-1 text-sm text-gray-700">
          <option value="hi">Hindi</option>
          <option value="en">English</option>
          <option value="gu">Gujarati</option>
          <option value="ur">Urdu</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ar">Arabic</option>
        </select>

        <button class="translate-btn px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md shadow hover:shadow-lg hover:scale-105 transition-all">
          🌍 Translate
        </button>
      </div>
    </div>
  `;
  quotesGrid.appendChild(article);
});

  currentIndex += nextBatch.length;
  loadMoreBtn.style.display = currentIndex >= filteredData.length ? "none" : "block";
}

// ✅ Translation Function
async function translateText(text, targetLang) {
  const MAX_LEN = 500;
  const parts = text.length > MAX_LEN
    ? Array.from({ length: Math.ceil(text.length / MAX_LEN) }, (_, i) => text.slice(i * MAX_LEN, (i + 1) * MAX_LEN))
    : [text];

  const translations = [];
  for (const part of parts) {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(part)}&langpair=en|${targetLang}&de=test@example.com`
    );
    const data = await res.json();
    translations.push(data.responseData?.translatedText || part);
  }
  return translations.join(" ");
}

// ✅ Event Delegation (Copy + Translate)
quotesGrid?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  // Translate
  if (btn.classList.contains("translate-btn")) {
    const article = btn.closest("article");
    const quoteTextEl = article.querySelector(".quote-text");
    const originalQuote = quoteTextEl.dataset.original;
    const targetLang = article.querySelector(".translate-lang").value;

    if (targetLang === "en") {
      quoteTextEl.textContent = `“${originalQuote}”`;
      quoteTextEl.dataset.translated = "";
      return;
    }

    btn.textContent = "⏳ Translating...";
    try {
      const translated = await translateText(originalQuote, targetLang);
      quoteTextEl.textContent = `“${originalQuote}”`;
      const span = document.createElement("span");
      span.className = "block mt-2 text-sm text-purple-700";
      span.textContent = `(${translated})`;
      quoteTextEl.appendChild(span);
      quoteTextEl.dataset.translated = translated;
    } catch (err) {
      console.error("Translation error:", err);
      btn.textContent = "❌ Failed";
    }
    btn.textContent = "🌍 Translate";
  }

  // Copy
  if (btn.classList.contains("copy-btn")) {
    const quoteTextEl = btn.closest("article").querySelector(".quote-text");
    const textToCopy = quoteTextEl.dataset.translated || quoteTextEl.dataset.original;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      btn.textContent = "✅ Copied!";
      setTimeout(() => (btn.textContent = "❤️ Copy Quote"), 1500);
    });
  }
});


// ✅ Load More
loadMoreBtn?.addEventListener("click", () => renderQuotes());

// ✅ Filter by Category
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  activeCategory = btn.dataset.filter;
  currentIndex = 0;
  quotesGrid.innerHTML = "";
  renderQuotes();
});

// ✅ Initial
fetchQuotes();
