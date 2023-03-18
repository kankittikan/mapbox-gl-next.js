import React, { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"

mapboxgl.accessToken = "pk.eyJ1Ijoib3lhc2hpeiIsImEiOiJjbGY2dXJuYXcxa3pkM3ZsaWQzbWI4NXZnIn0.EkevxE8HHmWibZtVsijOow";

export default function Map() {
  const mapContainer = useRef()
  

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 0,
      pitch: 50,
      interactive: false,
      attributionControl: false
    })

    const size = 100;

    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // Call once before every frame where the icon will be used.
      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
      }
    };

    map.on('load', () => {
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

      map.addSource('dot-point', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [98.906011, 8.088067] // icon position [lng, lat]
              }
            }
          ]
        }
      });
      map.addSource('dot-point2', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [100.571687, 13.831728] // icon position [lng, lat]
              }
            }
          ]
        }
      });

      map.addLayer({
        'id': 'layer-with-pulsing-dot',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });

      map.addLayer({
        'id': 'layer-with-pulsing-dot2',
        'type': 'symbol',
        'source': 'dot-point2',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });


    });

    setTimeout(() => {
      map.flyTo({
        center: [98.906011, 8.088067],
        speed: 0.3,
        zoom: 7,
        pitch: 30,
      });
    }, 1000)

  }, [])

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "800px" }}
    />
  )
}