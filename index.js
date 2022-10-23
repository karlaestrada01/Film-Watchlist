/**
 * Movie watchlist search page
 *      Users can search for the movie they want and add to their
 *      watchlist
 */
const movieContainer = document.querySelector(".movie-container")
const searchForm = document.querySelector(".search-form")
const searchInput = document.getElementById("search-input")

let watchlist = getWatchlist()

/**
 * Retrieves the watchlist from local storage
 * @returns
 *      the user's watchlist if it exists if not
 *      an empty array is returned
 */
function getWatchlist() {
    let watchlistJSON = localStorage.getItem("watchlist")
    if(watchlistJSON){
        return JSON.parse(watchlistJSON)
    }
    
    return []
}

/**
 * Checks if a certain movie is in the watchlist
 * @param {*} imdb 
 *      The imdb of a specific movie
 * @returns 
 *      true , if the watchlist contains the movie
 *      false, otherwise
 */
function isInWatchlist(imdb) {
    if(watchlist.indexOf(imdb) === -1){
        return true
    }
    else {
        return false
    }
    
}
/**
 * Event listener for when a user searches for a movie
 */
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    renderMoviesHtml()
    searchForm.reset()
})

/**
 * Retrieves the movies from the api
 * @returns 
 *      movie object if valid user input
 */
async function getMovies() {
    let data
    try{
        const response = await fetch(`https://www.omdbapi.com/?apikey=2e7dabe2&s=${searchInput.value}`)
        data = await response.json()
    } 
    catch(e) {
        console.log(e)
    }
    if(data){
        return data
    }
    
}

/**
 * Renders movie watchlist onto the screen
 */
function renderMoviesHtml(){
    getMovies().then(async movie => {
        if(movie.Response === 'True'){
            document.querySelector(".movie-container-no-search").classList.add("hidden")
            document.querySelector(".movie-cant-find").classList.add("hidden")
            movieContainer.classList.remove("hidden")
            let str = ''

            for(let movieItem of movie.Search){
                const response = await fetch(`https://www.omdbapi.com/?apikey=2e7dabe2&i=${movieItem.imdbID}`)
                const data = await response.json()
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
                                
                                <i class="fa-solid ${isInWatchlist(imdbID) ? "fa-circle-plus": "fa-circle-check"}  watchlist-icon" id="add-watchlist-${imdbID}"></i>
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
        }
        else {
            document.querySelector(".movie-container-no-search").classList.add("hidden")
            document.querySelector(".movie-cant-find").classList.remove("hidden")
            movieContainer.classList.add("hidden")
        }
    }) 
}

/**
 * Event listener if a user clicks on the plus icon of one the movies
 * on the watchlist
 */
movieContainer.addEventListener("click", (e) => {
    let targetId = e.target.id
    if(targetId){
        let value = e.target.parentElement.parentElement.parentElement.parentElement.id
        document.getElementById(targetId).classList.remove("fa-circle-plus")
        document.getElementById(targetId).classList.add("fa-circle-check")
        //if movie already in watchlist it cannot be added
        if(isInWatchlist(value)){
            watchlist.push(e.target.parentElement.parentElement.parentElement.parentElement.id)
            updateStorage()
        }
        
    }
})

/**
 * Updates local storage and its watchlist
 */
function updateStorage() {
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
}