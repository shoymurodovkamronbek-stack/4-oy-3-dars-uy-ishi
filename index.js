let API_KEY = 'dcea1fd7b3e65d34387ad6de7ef9cc5e';

let tokenTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
let tokenPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
let tokenUpComing = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`;

const append = document.querySelector(".append");
const btns = document.querySelectorAll(".btns");
const title = document.querySelector(".title");
const searchInput = document.querySelector("#search");

const minInput = document.querySelector("#min");
const maxInput = document.querySelector("#max");
const scoreInput = document.querySelector("#score");
const filterBtn = document.querySelector(".btn");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let movieType = window.localStorage.getItem("movieType") || "top_rated";
let page = Number(window.localStorage.getItem("page")) || 1;
let savedSearch = window.localStorage.getItem("searchText") || "";
let savedMin = window.localStorage.getItem("minYear") || "";
let savedMax = window.localStorage.getItem("maxYear") || "";
let savedScore = window.localStorage.getItem("scoreVal") || "";

title.textContent = page;
searchInput.value = savedSearch;
minInput.value = savedMin;
maxInput.value = savedMax;
scoreInput.value = savedScore;

btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        movieType = e.target.value;
        window.localStorage.setItem("movieType", movieType);
        
        page = 1;
        window.localStorage.setItem("page", page);
        title.textContent = page;
        
        searchInput.value = "";
        window.localStorage.removeItem("searchText");
        savedSearch = "";

        getMovies(movieType, page);
    });
});

async function getMovies(mType, pageNum, text = "") {
    let movieUrl = mType === "top_rated" ? tokenTop : mType === "popular" ? tokenPopular : tokenUpComing;
    try {
        let response = await axios.get(movieUrl + `&page=${pageNum}`);
        let movies = response.data.results;

        let query = text || savedSearch;
        if (query) {
            movies = movies.filter(movie => movie.original_title.toLowerCase().includes(query.toLowerCase()));
        }

        renderMovies(movies);
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
}

function renderMovies(movies) {
    append.innerHTML = null;

    if (movies.length === 0) {
        append.innerHTML = `<p style="color: white; padding: 20px; font-size: 18px;">Kinolar topilmadi.</p>`;
        return;
    }

    for (const movie of movies) {
        let backdrop = movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
            : 'https://via.placeholder.com/300x250';

        append.innerHTML += `
        <div class="movie">
            <img src="${backdrop}" alt="${movie.original_title}">
            <div class="movie-info">
                <h3>${movie.original_title}</h3>
                <span class="orange">${Math.floor(movie.vote_average || 0)}</span>
            </div>
            <span class="date">${movie.release_date || 'Nomaʼlum'}</span>
        </div>
        `;
    }
}

filterBtn.addEventListener("click", async () => {
    let minYear = minInput.value ? Number(minInput.value) : null;
    let maxYear = maxInput.value ? Number(maxInput.value) : null;
    let scoreVal = scoreInput.value ? Number(scoreInput.value) : null;

    window.localStorage.setItem("minYear", minInput.value);
    window.localStorage.setItem("maxYear", maxInput.value);
    window.localStorage.setItem("scoreVal", scoreInput.value);

    let movieUrl = movieType === "top_rated" ? tokenTop : movieType === "popular" ? tokenPopular : tokenUpComing;
    
    try {
        let response = await axios.get(movieUrl + `&page=${page}`);
        let movies = response.data.results;

        movies = movies.filter(movie => {
            let releaseYear = movie.release_date ? Number(movie.release_date.split('-')[0]) : 0;
            let voteAverage = movie.vote_average || 0;

            if (minYear && releaseYear < minYear) return false;
            if (maxYear && releaseYear > maxYear) return false;
            if (scoreVal && voteAverage < scoreVal) return false;

            return true;
        });

        renderMovies(movies);
    } catch (error) {
        console.error("Filtrlashda xatolik:", error);
    }
});

nextBtn.addEventListener("click", () => {
    page = Number(title.textContent) + 1;
    window.localStorage.setItem("page", page);
    title.textContent = page;
    getMovies(movieType, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

prevBtn.addEventListener("click", () => {
    page = Number(title.textContent) - 1;
    if (page < 1) {
        page = 1;
        return;
    }
    window.localStorage.setItem("page", page);
    title.textContent = page;
    getMovies(movieType, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

searchInput.addEventListener("input", (e) => {
    let text = e.target.value;
    window.localStorage.setItem("searchText", text);
    savedSearch = text;
    getMovies(movieType, page, text);
});

getMovies(movieType, page, savedSearch);