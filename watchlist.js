
const movieContainer = document.querySelector(".movie-container")


function getWatchlist() {
    let watchlistJSON = localStorage.getItem("watchlist")
    if(watchlistJSON){
        return JSON.parse(watchlistJSON)
    }
    
    return ""
}

async function renderWatchListHtml(){
    let watchlist = getWatchlist()
    let str = ""
    if(!watchlist || watchlist.length === 0){
         document.querySelector(".movie-container-no-search").classList.remove("hidden")
         movieContainer.innerHTML = str
    }
    else {
        document.querySelector(".movie-container-no-search").classList.add("hidden")
       
        if(watchlist){
            for(let listItem of watchlist){
                
                const response = await fetch(`https://www.omdbapi.com/?apikey=2e7dabe2&i=${listItem}`)
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
                                
                                <i class="fa-solid fa-circle-minus" id="remove-watchlist"></i>
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
            } //end of for loop
                movieContainer.innerHTML = str
            
        }
    }
   
}

movieContainer.addEventListener("click", (e) => {
    
    if(e.target.id){
        let watchlist = getWatchlist()
        let index = watchlist.indexOf(e.target.parentElement.parentElement.parentElement.parentElement.id)
        watchlist.splice(index, 1)
        updateStorage(watchlist)
        console.log(index)
        renderWatchListHtml()
    }
})

function updateStorage(watchlist) {
    if(watchlist.length === 0){
        localStorage.removeItem("watchlist")
    }
    else {
    localStorage.removeItem("watchlist")
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
}

renderWatchListHtml()