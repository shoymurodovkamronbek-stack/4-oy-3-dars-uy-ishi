// let API_KEY = 'b971c2f0de8767f08d2bb84160ba24b7'

let API_KEY = 'dcea1fd7b3e65d34387ad6de7ef9cc5e'

let tokenTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`
let tokenPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
let tokenUpComing = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`

const append = document.querySelector(".append");
const btns = document.querySelectorAll(".btns");

async function getTopMovies() {
    let topMovies = await axios.get(tokenTop);
    topMovies = topMovies.data.results;

    for (const movie of  topMovies) {
        append.innerHTML =+ `
        <div class="movie">
            <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt ="Fast &amp">
        `
    }
}

btns.forEach(btn=>{
    btn.addEventListener("click", (e) =>{
        let movieType = e.target.value
        window.localStorage.setItem("movieType", movieType)
        title.textContent = 1
        getMovies(movieType, 1)
    })
})

async function getMovies(movieType, page, text) {
    let movieUrl = movieType ==  "top_rated" ? tokentop : movieType == "popular" ? tokenPopular : tokenUpComing
    let topMovies = await axios.get(movieUrl + `&page=${page}`)
    topMovies = topMovies.data.results

    topMovies = text ? topMovies.filter(movie => movie.original_title )
}
