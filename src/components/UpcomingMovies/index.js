import React from 'react'
import Loader from 'react-loader-spinner'

import MovieCard from '../MovieCard'
import NavBar from '../NavBar'
import Pagination from '../Pagination'

import './index.css'

class UpcomingMovies extends React.Component {
  state = {
    isLoading: true,
    upcomingMovieResponse: {},
  }

  componentDidMount() {
    this.getUpcomingMoviesResponse()
  }

  getUpcomingMoviesResponse = async (page = 1) => {
    const API_KEY = 'ffdf27c347d3d6c9bc9e3eda7457a5dd'
    const apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    const updatedData = {
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: data.results.map(eachMovie => ({
        id: eachMovie.id,
        posterPath: `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`,
        voteAverage: Number(eachMovie.vote_average.toFixed(1)),
        title: eachMovie.title,
      })),
    }
    this.setState({isLoading: false, upcomingMovieResponse: updatedData})
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#032541" />
    </div>
  )

  renderPopularMoviesList = () => {
    const {upcomingMovieResponse} = this.state
    const {results} = upcomingMovieResponse

    return (
      <ul className="upcoming-movies-list">
        {results.map(movie => (
          <MovieCard key={movie.id} movieDetails={movie} />
        ))}
      </ul>
    )
  }

  render() {
    const {isLoading, upcomingMovieResponse} = this.state

    return (
      <>
        <NavBar />
        <div className="route-page-body">
          {isLoading
            ? this.renderLoadingView()
            : this.renderPopularMoviesList()}
        </div>
        <Pagination
          totalPages={upcomingMovieResponse.totalPages}
          apiCallback={this.getUpcomingMoviesResponse}
        />
      </>
    )
  }
}

export default UpcomingMovies
