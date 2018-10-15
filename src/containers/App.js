import React, { Component } from 'react';
import SearchBar from '../components/search-bar';
import VideoList from './Video-list';
import VideoDetail from '../components/video-detail';
import Video from '../components/Video';
import axios from 'axios';

const API_END_POINT = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL = "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false"
const API_KEY = "api_key=5ad70ac6ca2831adf390cdd7356d7d65"
//https://api.themoviedb.org/3/discover/movie?language=fr&sort_by=popularity.desc&include_adult=false
class App extends Component {
  constructor(props){
    super(props)
    this.state = {movieList:{}, currentMovie:{}}
  }

  componentWillMount() {
   this.iniMovies()
  }
  iniMovies(){
    axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then(function(response){
      this.setState({movieList:response.data.results.slice(1,6), currentMovie:response.data.results[0]}, function(){
        this.applyVideoToCurrentMovie();
      })
    
    }.bind(this));
  }
  applyVideoToCurrentMovie(){
    axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos&include_adult=false`).then(function(response){
     const youtubeKey = response.data.videos.results[0].key;
     let newCurrentMovieState = this.state.currentMovie;
     newCurrentMovieState.videoId = youtubeKey;
     this.setState({currentMovie : newCurrentMovieState});
    }.bind(this));
  }
  receiveCallBack(movie){
    this.setState({currentMovie:movie}, function(){
      this.applyVideoToCurrentMovie()
    })
  }

  render() {
    const renderVideoList = () => {
      if (this.state.movieList.length >= 5) {
        return <VideoList movieList={this.state.movieList} callBack={this.receiveCallBack.bind(this)}/>
      }
    }
    return (
      <div className="container">
        <div className="search_bar">
          <SearchBar/>
        </div>
        <div className="row">
          <div className="col-md-8">
            <Video videoId={this.state.currentMovie.videoId}/>
            <VideoDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview}/>
          </div>
          <div className="col-md-4">
            {renderVideoList()}
          </div>
          
        </div>
       
      </div>
    );
  }
}

export default App;
