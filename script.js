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

const categoryTitle = document.getElementById("categoryTitle");
const moviesContainer = document.getElementById("moviesContainer");
const currentCategoryEl = document.getElementById("currentCategory");
const totalCategoriesEl = document.getElementById("totalCategories");
const progressBar = document.querySelector(".progress-bar");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

totalCategoriesEl.textContent = categories.length;

function renderCategory() {
    const category = categories[currentCategory];

    categoryTitle.textContent = category.title;
    currentCategoryEl.textContent = currentCategory + 1;

    const progress = ((currentCategory + 1) / categories.length) * 100;
    progressBar.style.width = progress + "%";

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

        moviesContainer.appendChild(card);
    });
}

function saveVote() {
    const selected = document.querySelector('input[name="vote"]:checked');

    if (selected) {
        votes[currentCategory] = parseInt(selected.value);
        localStorage.setItem("votes", JSON.stringify(votes));
    }
}

nextBtn.addEventListener("click", () => {
    saveVote();

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
    saveVote();

    if (currentCategory > 0) {
        currentCategory--;
        renderCategory();
    }
});

function showThankYou() {
    document.body.innerHTML = `
        <div style="
            height:100vh;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            text-align:center;
            background:linear-gradient(135deg,#2d0b55,#7b2cbf);
            color:white;
            font-family:Poppins;
        ">
            <h1 style="color:gold;font-size:50px;">Dziękujemy!</h1>
            <p style="font-size:20px;">Twój głos został zapisany ✨</p>
        </div>
    `;
}

// start
renderCategory();
