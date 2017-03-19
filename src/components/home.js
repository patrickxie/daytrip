import React, { Component } from 'react';
import axios from 'axios';
import config from '../config';
import Trip from './home/trip-show';
import Weather from './home/weather';
import SortBar from './home/sort-bar';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripData: [],
      tripComponents: [],
      userData: {},
      weatherData:[],
      sortedData: []
    };
    this.fetchUserData = this.fetchUserData.bind(this);
    this.fetchTrips = this.fetchTrips.bind(this);
    this.fetchWeatherData = this.fetchWeatherData.bind(this);
    this.sort = this.sort.bind(this)
  }

  componentDidMount() {
    this.fetchUserData();
    this.fetchTrips();
    this.fetchWeatherData();
  }

  sort(target) {
    switch(target) {
      case 'likes':
        this.setState({ 
          sortedData: this.state.tripData.slice().sort((a, b) =>  b.likes - a.likes) 
        })
        break;
      case 'newest':
      this.setState({ sortedData: this.state.tripData.slice().reverse() })
        break;
      case 'tripname': 
          this.setState({ sortedData: this.state.tripData.slice().sort((a,b) => {
            return a.tripName.localeCompare(b.tripName)
          }) 
        })
          console.log(this.state.tripData)
        break;
      case 'oldest':
        this.setState({ sortedData: this.state.tripData.slice() })
        console.log(this.state.sortedData)
        break;
    } 
  }

  fetchTrips() {
    return axios.get(`${config.server}/trips`, {
      headers:{ authorization: localStorage.getItem('token') }
    }).then(res => this.setState({ tripData: res.data })).then(() => this.sort('likes'));
  }

  fetchUserData() {
    return axios.get(`${config.server}/user?username=${this.props.username}`, {
      headers:{ authorization: localStorage.getItem('token') }
    }).then(res => this.setState({userData: res.data}))
  }

  fetchWeatherData() {
    axios.get(`${config.server}/weather`, {
      headers:{ authorization: localStorage.getItem('token') }
    }).then(res => this.setState({ weatherData: res.data }))
  }

  render() {
    const tripComponents = this.state.sortedData.map(trip => <Trip trip={trip} key={trip._id} username={this.props.username} userData={this.state.userData} fetchUserData={this.fetchUserData} fetchTrips={this.fetchTrips}/>);
    return (
    <div style={{maxWidth:'1400px', margin: 'auto'}}>
      <div className="col-xs-8">
        <br/>
        {tripComponents}
      </div>
      <br/>
      <div className="col-xs-4">
      <SortBar sort={this.sort}/>
      <br/>
        <Weather data={this.state.weatherData}/>
      </div>
    </div>);
  }
}
