// 🔥 Add this at the very top of your JS file
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your Firebase config (already created in your Firebase project settings)
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

// Expose globally so your existing fetchQuotes() works
window.db = db;

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  // Smooth initial reveal of the navbar (prevents jank)
  requestAnimationFrame(() => {
    navbar.classList.remove("opacity-0", "-translate-y-2");
  });

  // Hamburger lines for animation
  const line1 = menuBtn.querySelector(".line1");
  const line2 = menuBtn.querySelector(".line2");
  const line3 = menuBtn.querySelector(".line3");

  const openMenu = () => {
    // Animate lines into "X"
    line1.classList.add("translate-y-[6px]", "rotate-45");
    line2.classList.add("opacity-0");
    line3.classList.add("-translate-y-[6px]", "-rotate-45");

    // Expand mobile menu
    mobileMenu.classList.remove("pointer-events-none");
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
    mobileMenu.classList.remove("opacity-0");
    mobileMenu.classList.add("opacity-100");
    menuBtn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    // Revert hamburger to 3 lines
    line1.classList.remove("translate-y-[6px]", "rotate-45");
    line2.classList.remove("opacity-0");
    line3.classList.remove("-translate-y-[6px]", "-rotate-45");

    // Collapse mobile menu
    mobileMenu.style.maxHeight = "0px";
    mobileMenu.classList.add("opacity-0");
    mobileMenu.classList.remove("opacity-100");
    // Delay pointer-events to allow fade-out transition
    setTimeout(() => mobileMenu.classList.add("pointer-events-none"), 200);
    menuBtn.setAttribute("aria-expanded", "false");
  };

  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  });

  // Close on md+ when resizing (prevents stuck states)
  const mq = window.matchMedia("(min-width: 768px)");
  const handleResize = () => {
    if (mq.matches) closeMenu();
  };
  mq.addEventListener ? mq.addEventListener("change", handleResize) : mq.addListener(handleResize);

  // Optional: close when clicking a link on mobile
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});





// Category filtering
  // const categoryButtons = document.querySelectorAll('.category-btn');
  //   const quotes = document.querySelectorAll('.quote-card');

  //   categoryButtons.forEach(button => {
  //     button.addEventListener('click', () => {
  //       const filter = button.dataset.filter;

  //       quotes.forEach(quote => {
  //         if (filter === 'all' || quote.dataset.category === filter) {
  //           quote.classList.remove('hidden');
  //         } else {
  //           quote.classList.add('hidden');
  //         }
  //       });

  //       // Active button styling
  //       categoryButtons.forEach(btn => btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-400'));
  //       button.classList.add('ring-2', 'ring-offset-2', 'ring-blue-400');
  //     });
  //   });




// JavaScript (Lazy Load + Category Filter)
 const quotesGrid = document.getElementById("quotesGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let quotesData = [];
  const itemsPerLoad = 4;  // how many quotes per batch
  let currentIndex = 0;
  let activeCategory = null; // show all initially

  // Fetch quotes from JSON
  // async function fetchQuotes() {
  //   try {
  //     const res = await fetch("quotes.json");
  //     quotesData = await res.json();
  //     // initial render
  //     renderQuotes();
  //   } catch (err) {
  //     console.error("Error fetching quotes:", err);
  //   }
  // }
  // Fetch quotes from Firestore
// Fetch quotes from Firestore

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


  // Render quotes (with category filter + lazy loading)
 function renderQuotes() {
  // 1) If activeCategory is "all" or falsy, don't filter
  const filteredData =
    !activeCategory || activeCategory.toLowerCase() === "all"
      ? quotesData
      : quotesData.filter(
          q => String(q.category).toLowerCase() === activeCategory.toLowerCase()
        );

  // If nothing to show, clear and hide Load More
  if (filteredData.length === 0) {
    quotesGrid.innerHTML = `
      <p class="p-4 text-center text-gray-600">No quotes found for this category.</p>
    `;
    loadMoreBtn.style.display = "none";
    return;
  }

// Append quotes
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

  // Create elements safely
  const title = document.createElement("h3");
  title.className = "text-xl font-bold bg-green-400 text-rose-700 my-2 text-center";
  title.textContent = quoteObj.category;

  const quoteText = document.createElement("p");
  quoteText.className = "italic text-gray-700 leading-relaxed py-3 px-4 quote-text";
  quoteText.dataset.original = quoteObj.quote;
  quoteText.dataset.translated = "";
  quoteText.textContent = `“${quoteObj.quote}”`;

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-black font-medium rounded-lg shadow-sm hover:shadow-md transition-all";
  copyBtn.textContent = "❤️ Copy Quote";

  const selectLang = document.createElement("select");
  selectLang.className = "translate-lang border rounded-lg px-2 py-1 text-gray-700 flex-1";
  selectLang.innerHTML = `
    <option value="hi">Hindi</option>
    <option value="es">Spanish</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="ur">Urdu</option>
    <option value="ar">Arabic</option>
    <option value="gu">Gujarati</option>
    <option value="en">English (Reset)</option>
  `;

  const translateBtn = document.createElement("button");
  translateBtn.className = "translate-btn px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all";
  translateBtn.textContent = "🌍 Translate";

  const btnRow = document.createElement("div");
  btnRow.className = "flex gap-2 items-center";
  btnRow.appendChild(selectLang);
  btnRow.appendChild(translateBtn);

  const btnContainer = document.createElement("div");
  btnContainer.className = "flex flex-col gap-2";
  btnContainer.appendChild(copyBtn);
  btnContainer.appendChild(btnRow);

  article.appendChild(title);
  article.appendChild(quoteText);
  article.appendChild(btnContainer);
  quotesGrid.appendChild(article);
});

// Utility: chunk text for MyMemory API
async function translateText(text, targetLang) {
  const MAX_LEN = 500;
  let parts = [];

  if (text.length > MAX_LEN) {
    for (let i = 0; i < text.length; i += MAX_LEN) {
      parts.push(text.slice(i, i + MAX_LEN));
    }
  } else {
    parts = [text];
  }

  let translations = [];
  for (let part of parts) {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(part)}&langpair=en|${targetLang}&de=test@example.com`
    );
    const data = await res.json();
    translations.push(data.responseData?.translatedText || part);
  }

  return translations.join(" ");
}

// Event delegation
quotesGrid.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  // Translate button
  if (btn.classList.contains("translate-btn")) {
    const article = btn.closest("article");
    const quoteTextEl = article.querySelector(".quote-text");
    const originalQuote = quoteTextEl.dataset.original;
    const targetLang = article.querySelector(".translate-lang").value;

    if (!originalQuote) return;

    if (targetLang === "en") {
      // Reset to original
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

  // Copy button
  if (btn.classList.contains("copy-btn")) {
    const quoteTextEl = btn.closest("article").querySelector(".quote-text");
    const textToCopy = quoteTextEl.dataset.translated || quoteTextEl.dataset.original;
    if (!textToCopy) return console.error("No text found to copy");

    navigator.clipboard.writeText(textToCopy).then(() => {
      btn.textContent = "✅ Copied!";
      setTimeout(() => (btn.textContent = "❤️ Copy Quote"), 1500);
    });
  }
});



  // 2) Increment by what we actually rendered
  currentIndex += nextBatch.length;

  // Hide "Load More" if no more quotes
  if (currentIndex >= filteredData.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  // 3) Attach copy event to all new copy buttons
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.dataset.quote;
      navigator.clipboard.writeText(textToCopy).then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = "Copy Quote", 1500);
      }).catch(err => {
        console.error("Failed to copy:", err);
      });
    });
  });
}


  // Load More Button Click
  loadMoreBtn.addEventListener("click", () => {
    renderQuotes();
  });

  // Filter by category (when clicking tags)
  function filterByCategory(category) {
    activeCategory = category;
    currentIndex = 0;
    quotesGrid.innerHTML = ""; // clear previous quotes
    renderQuotes();
  }

  // 3) Robust event delegation for buttons like:
  // <button data-filter="all">All</button>
  // <button data-filter="love">Love</button>
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    filterByCategory(btn.dataset.filter);
  });

  // Initial fetch
  fetchQuotes();
// Shayari Tranlator


//  const quoteForm = document.getElementById("quoteForm");
//   const quotesList = document.getElementById("quotesList");

//   // Add Quote to Firestore
//   quoteForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const text = document.getElementById("quoteText").value;
//     const author = document.getElementById("quoteAuthor").value;

//     await db.collection("quotes").add({
//       text: text,
//       author: author,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp()
//     });

//     quoteForm.reset();
//     loadQuotes();
//   });

  // // Load Quotes from Firestore
  // async function loadQuotes() {
  //   quotesList.innerHTML = "";
  //   const snapshot = await db.collection("quotes").orderBy("createdAt", "desc").get();
  //   snapshot.forEach((doc) => {
  //     const quote = doc.data();
  //     const li = document.createElement("li");
  //     li.textContent = `"${quote.text}" — ${quote.author}`;
  //     quotesList.appendChild(li);
  //   });
  // }

  // loadQuotes();

  