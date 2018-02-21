import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

class Map extends React.Component {

    constructor(props) {
        super(props);
        const {lat, lng} = this.props.initialCenter;
        this.state = {
            currentLocation: {
            lat: lat,
            lng: lng
            }
        }
    }

  // componentDidMount, which will house data for using geolocation
    componentDidMount(){
        if(this.props.userBrowserLocation){
            if(navigator && navigator.geolocation){
                // using navigator to get the current position of the browser
                navigator.geolocation.getCurrentPosition((position) => {
                    const coords = position.coords; // seting the 
                    this.setState({// set the state of currentLocation to the lat lng of the browser
                        currentLocation:{
                            lat: coords.latitude,
                            lng: coords.longitude
                        }
                    })
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.loadMap();// loadMap function 
        if (prevState.currentLocation !== this.state.currentLocation) {//
            this.recenterMap();// function to recenter the map to the current browser location
        }
    }

  // function to recenter the map
    recenterMap(){

        const map = this.map;
        const curr = this.state.currentLocation;

        const google = this.props.google;
        const maps = google.maps;

        if (map) {
            let center = new maps.LatLng(curr.lat, curr.lng)
            map.panTo(center)
        }
    }


    loadMap() {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);

            let {initialCenter, zoom} = this.props;
            const {lat, lng} = this.state.currentLocation;
            const center = new maps.LatLng(lat, lng);
            const mapConfig = Object.assign({}, {
            center: center,
            zoom: zoom
            })
            this.map = new maps.Map(node, mapConfig);
            // passing the props from the image data we were able to get from the api call in map container

            this.props.imageData.map((data) => {
                console.log("placing marker on map")
                const marker = new google.maps.Marker({
                    position: {lat:data.lat, lng:data.lng},
                    map: this.map,
                    title: data.title
                    // icon: data.image
                });
                //style="height:100px; width:100px;" class="center-aligned"
                const infowindow = new google.maps.InfoWindow({
                    content: `
                    <div class="container right-align">
                    <img src=${data.image} style="height:200px; width:200px" class="responsive marker-image" id=${data.title}>
                    <h5>Title: ${data.title}</h5>
                    <h5>Date: ${data.dateAdded}</h5>
                    <h5>Notes: ${data.notes}</h5>
                    </div>`
                });
                // eventlistener - when the marker is clicked, open the infowindow
                marker.addListener('click', function() {
                    infowindow.open(this.map, marker);
                });

            })

        }
    }
  //
  render() {
    return (
    <div ref="map" style={style}>
      Loading Map...
    </div>)
  }
}

export default Map;

const style = {
  width: '100vw',
  height: '100vh'
}
Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  useBrowserLocation: PropTypes.bool // a boolean for using browser location or not
}
Map.defaultProps = {
    zoom: 14,
    //Chicago is default center
    //testing new york as center
    initialCenter: {
        lat: 40.730610,
        lng: -73.935242
    },
    useBrowserLocation: false
}
