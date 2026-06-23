const categories = [
    {
        title: "Najlepszy Film",
        movies: [
            { name: "Film 1", yt: "dQw4w9WgXcQ" },
            { name: "Film 2", yt: "dQw4w9WgXcQ" },
            { name: "Film 3", yt: "dQw4w9WgXcQ" },
            { name: "Film 4", yt: "dQw4w9WgXcQ" },
            { name: "Film 5", yt: "dQw4w9WgXcQ" }
        ]
    },
    {
        title: "Najlepsza Komedia",
        movies: [
            { name: "Komedia 1", yt: "dQw4w9WgXcQ" },
            { name: "Komedia 2", yt: "dQw4w9WgXcQ" },
            { name: "Komedia 3", yt: "dQw4w9WgXcQ" },
            { name: "Komedia 4", yt: "dQw4w9WgXcQ" },
            { name: "Komedia 5", yt: "dQw4w9WgXcQ" }
        ]
    },
    {
        title: "Najlepszy Aktor",
        movies: [
            { name: "Aktor 1", yt: "dQw4w9WgXcQ" },
            { name: "Aktor 2", yt: "dQw4w9WgXcQ" },
            { name: "Aktor 3", yt: "dQw4w9WgXcQ" },
            { name: "Aktor 4", yt: "dQw4w9WgXcQ" },
            { name: "Aktor 5", yt: "dQw4w9WgXcQ" }
        ]
    }
];

let currentCategory = 0;
let votes = JSON.parse(localStorage.getItem("votes")) || {};

// Pobieranie elementów DOM
const categoryTitle = document.getElementById("categoryTitle");
const moviesContainer = document.getElementById("moviesContainer");
const currentCategoryEl = document.getElementById("currentCategory");
const totalCategoriesEl = document.getElementById("totalCategories");
const progressBar = document.querySelector(".progress-bar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const mainContainer = document.querySelector(".container");

// Skrypt uruchamia się tylko na stronie glosowanie.html (tam, gdzie te elementy istnieją)
if (categoryTitle && moviesContainer && nextBtn) {
    
    totalCategoriesEl.textContent = categories.length;

    function renderCategory() {
        const category = categories[currentCategory];

        categoryTitle.textContent = category.title;
        currentCategoryEl.textContent = currentCategory + 1;

        const progress = ((currentCategory + 1) / categories.length) * 100;
        progressBar.style.width = progress + "%";

        // Blokowanie przycisku Wstecz na pierwszej kategorii
        prevBtn.disabled = currentCategory === 0;
        
        // Zmiana tekstu przycisku na ostatniej stronie
        if (currentCategory === categories.length - 1) {
            nextBtn.textContent = "Zakończ głosowanie ✓";
        } else {
            nextBtn.textContent = "Następna →";
        }

        moviesContainer.innerHTML = "";

        category.movies.forEach((movie, index) => {
            const savedVote = votes[currentCategory];

            const card = document.createElement("div");
            card.className = "movie-card";

            card.innerHTML = `
                <h3>${movie.name}</h3>
                <iframe src="https://www.youtube.com/embed/${movie.yt}" allowfullscreen></iframe>
                <label>
                    <input type="radio" name="vote" value="${index}" ${savedVote == index ? "checked" : ""}>
                    Głosuję na ten film
                </label>
            `;

            // Natychmiastowy zapis w localStorage po kliknięciu w radio button
            card.querySelector('input[type="radio"]').addEventListener('change', (e) => {
                votes[currentCategory] = parseInt(e.target.value);
                localStorage.setItem("votes", JSON.stringify(votes));
            });

            moviesContainer.appendChild(card);
        });
    }

    nextBtn.addEventListener("click", () => {
        // Sprawdzamy, czy głos w aktualnej kategorii został oddany
        if (votes[currentCategory] === undefined) {
            alert("Oddaj głos zanim przejdziesz dalej!");
            return;
        }

        if (currentCategory < categories.length - 1) {
            currentCategory++;
            renderCategory();
        } else {
            showThankYou();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentCategory > 0) {
            currentCategory--;
            renderCategory();
        }
    });

   function showThankYou() {
    // POKAZUJEMY EKRAN ŁADOWANIA, ŻEBY UŻYTKOWNIK WIDZIAŁ, ŻE GŁOS SIĘ WYSYŁA
    mainContainer.innerHTML = `
        <div style="padding: 60px 20px; text-align: center; font-family: 'Poppins', sans-serif;">
            <h1 style="color: gold; font-family: 'Cinzel', serif; font-size: 2.5rem; margin-bottom: 20px; text-shadow: 0 0 15px gold;">Rejestrowanie głosu...</h1>
            <p style="font-size: 1.2rem; color: #fff;">Proszę czekać, zapisujemy Twoje wybory ✨</p>
        </div>
    `;

    // 1. Mapujemy indeksy (0,1,2,3...) na realne nazwy filmów, żeby w arkuszu mieć jasne tytuły, a nie cyfry
    const payload = {
        film: categories[0].movies[votes[0]].name,    // Nazwa filmu z 1. kategorii
        komedia: categories[1].movies[votes[1]].name, // Nazwa filmu z 2. kategorii
        aktor: categories[2].movies[votes[2]].name     // Nazwa filmu z 3. kategorii
    };

    // 2. TUTAJ WKLEJ SWÓJ URL WYGENEROWANY W KROKU 2 Z GOOGLE APPS SCRIPT
    const googleAppScriptUrl = "https://script.google.com/macros/s/AKfycbzcIgwQa5M6Sx7TYyb2T5sUgEaHXIaJNHqp80PVzaJIPJlnDlzRgY91DVLv2STUdWmHLQ/exec";

    // 3. Wysyłamy dane w tle za pomocą technologii Fetch API
    fetch(googleAppScriptUrl, {
        method: "POST",
        mode: "no-cors", // Wymagane przy prostych skryptach Google Apps Script, zapobiega błędom CORS
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        // Po udanym wysłaniu czyścimy pamięć podręczną i pokazujemy ostateczne podziękowanie
        localStorage.removeItem("votes");

        mainContainer.innerHTML = `
            <div style="padding: 60px 20px; text-align: center; font-family: 'Poppins', sans-serif;">
                <h1 style="color: gold; font-family: 'Cinzel', serif; font-size: 3rem; margin-bottom: 20px; text-shadow: 0 0 15px gold;">Dziękujemy!</h1>
                <p style="font-size: 1.2rem; color: #fff; margin-bottom: 30px;">Twój głos został pomyślnie zarejestrowany w bazie danych. ✨</p>
                <a href="index.html" style="
                    display: inline-block;
                    padding: 15px 35px;
                    background: #6f2dbd;
                    color: white;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: 0.3s;
                " onmouseover="this.style.background='#8a3ffc'; this.style.transform='translateY(-3px)'" 
                   onmouseout="this.style.background='#6f2dbd'; this.style.transform='translateY(0)'">
                    Powrót do strony głównej
                </a>
            </div>
        `;
    })
    .catch(err => {
        console.error("Błąd podczas wysyłania głosu:", err);
        alert("Wystąpił problem z połączeniem. Spróbuj kliknąć zakończ ponownie.");
    });
}

    // Pierwsze uruchomienie przy wejściu na stronę
    renderCategory();
}
