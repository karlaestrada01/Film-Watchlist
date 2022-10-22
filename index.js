
const movieContainer = document.querySelector(".movie-container")
const searchForm = document.querySelector(".search-form")
const searchInput = document.getElementById("search-input")

let watchlist = []

searchForm.addEventListener('submit', (e) => {

    e.preventDefault()

    renderMoviesHtml()
   
   


})

async function getMovies() {
    const response = await fetch(`http://www.omdbapi.com/?apikey=2e7dabe2&s=${searchInput.value}`)
    const data = await response.json()
    console.log(data)
    return data
}

function renderMoviesHtml(){
    getMovies().then(async movie => {
        if(movie.Response === 'True'){
            document.querySelector(".movie-container-no-search").classList.add("hidden")
            let str = ''

            for(let movieItem of movie.Search){
                const response = await fetch(`http://www.omdbapi.com/?apikey=2e7dabe2&i=${movieItem.imdbID}`)
                const data = await response.json()
                console.log(data)
                const {Poster, Title, imdbRating, Genre, Plot, Runtime, imdbID} = data
                str +=
                `
                <div class="movie-item-container" id="${imdbID}">

                    <div class="movie-img">
                        <img class="poster" src="${Poster}">
                    </div>
                    <div class="movie-info">
                        <div class="movie-title">
                            <h2 class="movie-name">${Title}</h2>
                            <i class="fa-solid fa-star"></i>
                            <p class="rating">${imdbRating}</p>
        
                        </div>
                        <div class="movie-other-info">
                            <h4 class="movie-duration">${Runtime}</h4>
                            <h4 class="genre">${Genre}</h4>
                            <div class="add-watchlist">
                                
                                <i class="fa-solid fa-circle-plus fa-sm" id="add-watchlist"></i>
                                <h4>Watchlist</h4>
                            </div>
                        </div>
                        <div class="plot-container">
                            <p class="plot-description">
                                ${Plot}
                            </p>
                        </div>
                        
                    </div>
                </div>
                    
                    
                    `
            }
            movieContainer.innerHTML = str
        }//if true 
        else {
            console.log("no find")
        }
    }) //getmove().then
}

movieContainer.addEventListener("click", (e) => {

    if(e.target.id){
        watchlist.push(e.target.parentElement.parentElement.parentElement.parentElement.id)
        updateStorage()
    }
})

function updateStorage() {
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
}