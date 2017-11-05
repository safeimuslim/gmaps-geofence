import React, { Component } from 'react';
import './App.css';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import _ from 'lodash';

let map;
let bounds = new window.google.maps.LatLngBounds();
let sub_area;
let coordinates=[];
let i = 0;
let color = ['#FF0000', '#4286f4','#ffff00','#ff00b2','#bb00ff','#00ffff','#26ff00','#00ff87'];

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      options: [],
      selected: []
    }
    this._handleSearch = this._handleSearch.bind(this);
    this.renderCoordinate = this.renderCoordinate.bind(this);

  }

  componentDidMount(){
    map = new window.google.maps.Map(document.getElementById('map'),{
      center: {lat: -6.226996, lng: 106.819894},
      zoom: 10,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      },
      scrollwheel: false,
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: 'roadmap',
    });
  }

  _handleSearch(query) {
    if (!query) {
      return;
    }
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&format=json`)
      .then(resp => resp.json())
      .then(data => {
        let filterGeoJsonType = data.filter(function(data){
          return data.geojson.type === "MultiPolygon" || data.geojson.type === "Polygon"
        });
        this.setState({options: filterGeoJsonType});
      });
    }, 1000)
  }

  renderCoordinate(paths){
      coordinates = [];
      let position = 0;
      paths.map((location) =>{
          if(position %10 === 0){
            coordinates.push({"lat": location[1], "lng": location[0]});
            bounds.extend({"lat": location[1], "lng": location[0]});
          }
          position++
          return true;
      });
    }

  _onSelectOptions(option, event){
      if(option.geojson.type === "MultiPolygon"){
        this.renderCoordinate(option.geojson.coordinates[0][0]);
      }else if(option.geojson.type === "Polygon"){
        this.renderCoordinate(option.geojson.coordinates[0]);
      }else{
        alert('option.geojson.type: MultiPolygon & Polygon');
      }
      
      if(coordinates.length > 1){
        sub_area = new window.google.maps.Polygon({
          paths: coordinates,
          strokeColor: color[i],
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color[i],
          fillOpacity: 0.35,
          editable: true
        });
        
        sub_area.setMap(map);
        map.setOptions({ maxZoom: 15 });
        map.fitBounds(bounds);

        coordinates = [];
      }
      i++;
    }

  render() {
    return (
      <div className="container" style={{height: `100%`}}>
        <div className="page-header">
            <h1>Area Geofencing on a Google Maps - React JS Example Projects</h1>
          </div>
          <p className="lead">
            Welcome to the first series React JS Example Projects. This series explain how to create Area Geofencing on a Google Maps with React JS, hopefully we can learn together.
            <br></br>
            To create area geofencing we must find area boundaries and draw on google maps as polygon. During the writing of this series, area boundaries feature not available in the Google Maps API. 
            The solution is using OpenStreetMap API for getting area boundaries <a href="#">more...</a>
          </p>
          <a href="https://www.youtube.com/watch?v=hLaRG0uZPWc" className="btn btn-primary">DEMO</a> &nbsp;
          <a href="https://github.com/safeimuslim/gmaps-geofence" className="btn btn-primary">DOWNLOAD</a> &nbsp;
          <br></br>&nbsp;
           <AsyncTypeahead
                align="justify"
                multiple
                selected={this.state.selected}
                labelKey="display_name"
                onSearch={this._handleSearch.bind(this)}
                options={this.state.options}
                placeholder="Search city, ex: tomang or jakarta selatan..."
                renderMenuItemChildren={(option, props, index) => (
                    <div onClick={this._onSelectOptions.bind(this, option)}>
                      <span>{option.display_name}</span>
                  </div>
                )}/>
              
              <div className="maps" id="map"></div>

              <footer className="footer">
                <p>developed by <a href="https://github.com/safeimuslim">@safeimuslim</a></p>
              </footer>
      </div>
    );
  }
}

export default App;
