import React, { Component } from 'react';
import './App.css';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import _ from 'lodash';

let map;
let sub_area;
let coordinates=[];
let i = 0;
let color = ['#FF0000', '#4286f4','#ffff00','#ff00b2','#bb00ff','#00ffff','#26ff00','#00ff87'];

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      allowNew: false,
      multiple: false,
      options: [],
      selected: [],
      markers: [{
        position: {
          lat: 25.0112183,
          lng: 121.52067570000001,
        },
        key: `Taiwan`,
        defaultAnimation: 2,
      }]
    }
    this._handleChange = this._handleChange.bind(this);
    this._handleSearch = this._handleSearch.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
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

   handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }

   

  _handleChange(e) {
    const {checked, name} = e.target;
    this.setState({[name]: checked});
  }

  _handleSearch(query) {
    if (!query) {
      return;
    }
    fetch(`http://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&format=json`)
      .then(resp => resp.json())
      .then(json => {
        this.setState({options: json});
      });
  }

  renderCoordinate(paths){
      coordinates = [];
      paths.map((location) =>{
          coordinates.push({"lat": location[1], "lng": location[0]});
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
        coordinates = [];
      }
      
    }

  render() {
    return (
      <div className="container" style={{height: `100%`}}>
        <div className="page-header">
            <h1>Google Maps Area Geofencing - React JS Example</h1>
          </div>
          <p className="lead">Pin a fixed-height footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code>padding-top: 60px;</code> on the <code>body &gt; .container</code>.</p>
          <p>Back to <a href="../sticky-footer">the default sticky footer</a> minus the navbar.</p>
        
           <AsyncTypeahead
                align="justify"
                multiple
                selected={this.state.selected}
                labelKey="display_name"
                onSearch={_.debounce(this._handleSearch.bind(this), 2000)}
                options={this.state.options}
                placeholder="Search city..."
                renderMenuItemChildren={(option, props, index) => (
                    <div onClick={this._onSelectOptions.bind(this, option)}>
                      <span>{option.display_name}</span>
                  </div>
                )}/>
              
              <div className="maps" id="map"></div>

              <footer className="footer">
                <p>&copy; 2016 Company, Inc.</p>
              </footer>
      </div>
    );
  }
}

export default App;
