// Example starter JavaScript for disabling form submissions if there are invalid fields
console.log("SCRIPT LOADED");
(() => {
  'use strict'

  const categoryNavbar = document.querySelector('.category-navbar')
  let previousScrollPosition = window.scrollY

  if (categoryNavbar) {
    window.addEventListener('scroll', () => {
      const currentScrollPosition = window.scrollY
      const scrollingDown = currentScrollPosition > previousScrollPosition

      if (currentScrollPosition > 90 && scrollingDown) {
        categoryNavbar.classList.add('is-collapsed')
      } else if (!scrollingDown) {
        categoryNavbar.classList.remove('is-collapsed')
      }

      previousScrollPosition = currentScrollPosition
    }, { passive: true })
  }

  const findMapElement = document.querySelector('#find-map')

  if (findMapElement && typeof L !== 'undefined') {
    const map = L.map(findMapElement).setView([20, 0], 2)
    const status = document.querySelector('#find-map-status')
    const closestLink = document.querySelector('#closest-listing-link')
    const listingElements = Array.from(document.querySelectorAll('#listing-location-data [data-listing-title]'))
    const locatedListings = []
    let selectedMarker

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    const distanceInKilometers = (first, second) => {
      const earthRadius = 6371
      const latitudeDifference = (second[0] - first[0]) * Math.PI / 180
      const longitudeDifference = (second[1] - first[1]) * Math.PI / 180
      const latitudeOne = first[0] * Math.PI / 180
      const latitudeTwo = second[0] * Math.PI / 180
      const value = Math.sin(latitudeDifference / 2) ** 2
        + Math.sin(longitudeDifference / 2) ** 2 * Math.cos(latitudeOne) * Math.cos(latitudeTwo)
      return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
    }

    const locateListings = async () => {
      for (const listingElement of listingElements) {
        const query = encodeURIComponent(listingElement.dataset.listingLocation)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`)
        const results = await response.json()

        if (results[0]) {
          const coordinates = [Number(results[0].lat), Number(results[0].lon)]
          L.marker(coordinates).addTo(map).bindPopup(`<strong>${listingElement.dataset.listingTitle}</strong>`)
          locatedListings.push({ element: listingElement, coordinates })
        }
      }
    }

    map.on('click', event => {
      if (!locatedListings.length) return

      const selectedCoordinates = [event.latlng.lat, event.latlng.lng]
      const closestListing = locatedListings.reduce((closest, listing) => {
        const listingDistance = distanceInKilometers(selectedCoordinates, listing.coordinates)
        return listingDistance < closest.distance ? { ...listing, distance: listingDistance } : closest
      }, { distance: Infinity })

      if (selectedMarker) map.removeLayer(selectedMarker)
      selectedMarker = L.marker(selectedCoordinates, {
        icon: L.divIcon({
          className: '',
          html: '<span class="nearest-map-marker"><i class="fa-solid fa-compass"></i></span>',
          iconSize: [38, 38],
          iconAnchor: [19, 38]
        })
      }).addTo(map)

      closestLink.href = closestListing.element.dataset.listingUrl
      closestLink.classList.remove('d-none')
      status.textContent = `Closest stay: ${closestListing.element.dataset.listingTitle} (${Math.round(closestListing.distance)} km away).`
    })

    locateListings()
      .then(() => {
        status.textContent = locatedListings.length
          ? 'Click anywhere on the map to find the closest stay.'
          : 'No listing locations could be loaded.'
      })
      .catch(() => { status.textContent = 'Listing locations could not be loaded.' })
  }

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()