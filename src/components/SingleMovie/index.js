import React from 'react'
import Loader from 'react-loader-spinner'

import NavBar from '../NavBar'

import './index.css'

class SingleMovie extends React.Component {
  state = {
    isLoading: true,
    singleMovieDetails: {},
    movieCastDetails: {},
    selectedSection: 'movie',
  }

  componentDidMount() {
    this.getSingleMovieDetails()
    this.getMovieCastDetails()
  }

  getSingleMovieDetails = async () => {
    const API_KEY = 'ffdf27c347d3d6c9bc9e3eda7457a5dd'
    const {match} = this.props
    const {params} = match
    const {id} = params
    const MOVIE_ID = id
    const apiUrl = `https://api.themoviedb.org/3/movie/${MOVIE_ID}?api_key=${API_KEY}&language=en-US`
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
    const updatedData = {
      id: data.id,
      posterPath: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      title: data.title,
      tagline: data.tagline,
      voteAverage: data.vote_average.toFixed(1),
      status: data.status,
      homepage: data.homepage,
      description: data.overview,
      spokenLanguages: data.spoken_languages.map(each => ({
        id: each.iso_639_1,
        englishName: each.english_name,
        name: each.name,
      })),
      releaseDate: data.release_date,
      runtime: data.runtime,
      genres: data.genres.map(eachGenre => ({
        id: eachGenre.id,
        name: eachGenre.name,
      })),
    }
    this.setState({isLoading: false, singleMovieDetails: updatedData})
  }

  getMovieCastDetails = async () => {
    const API_KEY = 'ffdf27c347d3d6c9bc9e3eda7457a5dd'
    const {match} = this.props
    const {params} = match
    const {id} = params
    const MOVIE_ID = id
    const apiUrl = `https://api.themoviedb.org/3/movie/${MOVIE_ID}/credits?api_key=${API_KEY}&language=en-US`
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
    const formattedData = {
      castDetails: data.cast.map(each => ({
        id: each.id,
        name: each.name,
        profilePath: `https://image.tmdb.org/t/p/w500${each.profile_path}`,
        characterName: each.character,
      })),
    }
    this.setState({isLoading: false, movieCastDetails: formattedData})
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#032541" />
    </div>
  )

  renderSingleMovieList = () => {
    const {singleMovieDetails} = this.state
    console.log(singleMovieDetails)
    return (
      <div className="single-movie-container">
        <div>
          <img
            src={singleMovieDetails.posterPath}
            alt={singleMovieDetails.title}
            className="single-movie-image"
          />
        </div>
        <div className="single-movie-details-container">
          <h1>{singleMovieDetails.title}</h1>
          <p>{singleMovieDetails.tagline}</p>
          <p>Rating: {singleMovieDetails.voteAverage}</p>
          <p>Description: {singleMovieDetails.description}</p>
          <a
            href={singleMovieDetails.homepage}
            target="_blank"
            rel="noreferrer"
            className="link-homepage"
          >
            HomePage
          </a>
          <p>Release date: {singleMovieDetails.releaseDate}</p>
          <p>Status of Movie: {singleMovieDetails.status}</p>
          <p>Duration of Movie: {singleMovieDetails.runtime} Min</p>
          <p>
            Genres of Movie:{' '}
            {singleMovieDetails.genres.map(each => each.name).join(', ')}
          </p>
        </div>
      </div>
    )
  }

  renderCastDetailsList = () => {
    const {movieCastDetails} = this.state
    const {castDetails = []} = movieCastDetails

    return (
      <div className="cast-container">
        <h2>Cast Section</h2>
        <ul className="cast-list">
          {castDetails.map(each => (
            <li key={each.id} className="cast-item">
              <img
                src={each.profilePath}
                alt={each.name}
                className="cast-image"
              />
              <p className="cast-name">{each.name}</p>
              <p className="character-name">as {each.characterName}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {isLoading, selectedSection} = this.state

    return (
      <>
        <NavBar />
        <div className="route-page-body">
          {isLoading ? (
            this.renderLoadingView()
          ) : (
            <>
              <div className="section-toggle-buttons">
                <button
                  type="button"
                  className={`section-button ${
                    selectedSection === 'movie' ? 'active' : ''
                  }`}
                  onClick={() => this.setState({selectedSection: 'movie'})}
                >
                  Movie Section
                </button>
                <button
                  type="button"
                  className={`section-button ${
                    selectedSection === 'cast' ? 'active' : ''
                  }`}
                  onClick={() => this.setState({selectedSection: 'cast'})}
                >
                  Cast Section
                </button>
              </div>
              {selectedSection === 'movie'
                ? this.renderSingleMovieList()
                : this.renderCastDetailsList()}
            </>
          )}
        </div>
      </>
    )
  }
}

export default SingleMovie
