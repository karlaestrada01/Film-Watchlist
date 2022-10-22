
const movieContainer = document.querySelector(".movie-container")
const searchForm = document.querySelector(".search-form")
const searchInput = document.getElementById("search-input")

let watchlist = getWatchlist()

function getWatchlist() {
    let watchlistJSON = localStorage.getItem("watchlist")
    if(watchlistJSON){
        return JSON.parse(watchlistJSON)
    }
    
    return []
}

function isInWatchlist(imdb) {
    if(watchlist.indexOf(imdb)===-1){
        return true
    }
    else {
        return false
    }
    
}
searchForm.addEventListener('submit', (e) => {

    e.preventDefault()

    renderMoviesHtml()
   
    searchForm.reset()
   


})

async function getMovies() {
    let data
    try{
    const response = await fetch(`http://www.omdbapi.com/?apikey=2e7dabe2&s=${searchInput.value}`)
     data = await response.json()
    
    
    } 
    catch(e) {
       console.log(e)
        console.log("in erh")

    }
    if(data){
        return data
    }
    else {
        console.log("idk")
    }
    
   
}

function renderMoviesHtml(){
    

    getMovies().then(async movie => {
        if(movie.Response === 'True'){
            document.querySelector(".movie-container-no-search").classList.add("hidden")
            document.querySelector(".movie-cant-find").classList.add("hidden")
            movieContainer.classList.remove("hidden")
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
        }//if true 
        else {
            document.querySelector(".movie-container-no-search").classList.add("hidden")
            document.querySelector(".movie-cant-find").classList.remove("hidden")
            movieContainer.classList.add("hidden")
            console.log("in here bro")

        }
    }) //getmove().then
}

movieContainer.addEventListener("click", (e) => {


    let targetId = e.target.id
    if(targetId){
        
        let value = e.target.parentElement.parentElement.parentElement.parentElement.id

        document.getElementById(targetId).classList.remove("fa-circle-plus")
        document.getElementById(targetId).classList.add("fa-circle-check")
        //if movie already in watchlist it cannot be added
        if(watchlist.indexOf(value) === -1){
            watchlist.push(e.target.parentElement.parentElement.parentElement.parentElement.id)
            updateStorage()
        }
        
    }
})

function updateStorage() {
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
}