async function loadHotelDetails() {
  try {
    const response = await fetch("hotel.json");
    if (!response.ok) throw new Error("Failed to fetch JSON file");

    const data = await response.json();

    const {
      logo,
      name,
      address,
      stars,
      propertyInfo,
      photoGallery,
      facilities,
      location,
    } = data.hotel;

    // Update hotel details
    document.getElementById("hotelLogo").src = logo;
    document.getElementById("hotelName").textContent = name;
    document.getElementById("hotelAddress").textContent = address;

    // Render stars
    const starsElement = document.getElementById("hotelStars");
    starsElement.innerHTML =
      Array(Math.floor(stars)).fill('<i class="fas fa-star"></i>').join("") +
      (stars % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : "");

    // Render photo gallery
    renderPhotos(photoGallery);

    // Render facilities
    renderFacilities(facilities);

    // Load map
    if (location && location.latitude && location.longitude) {
      initializeMap(location.latitude, location.longitude, name);
    }

    // Load policy
    loadPolicyFromFile();
  } catch (error) {
    console.error("Error loading hotel details:", error);
  }
}

function renderPhotos(photoGallery) {
  const galleryContainer = document.getElementById("photoGallery");
  galleryContainer.innerHTML = photoGallery
    .map(
      (photo) =>
        `<div class="col-6 col-sm-4 col-md-3 mb-4"><img src="${photo}" alt="Room Photo" onerror="this.src='default-image.jpg';"></div>`
    )
    .join("");
}

function renderFacilities(facilities) {
  const facilitiesContainer = document.getElementById("facilitiesContainer");
  facilitiesContainer.innerHTML = facilities
    .map(
      ({ icon, name }) =>
        `<div class="facility-card"><span class="material-icons">${icon}</span><h6>${name}</h6></div>`
    )
    .join("");
}

function initializeMap(lat, lng, hotelName) {
  const map = L.map("map").setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${hotelName}</b><br>Latitude: ${lat}<br>Longitude: ${lng}`)
    .openPopup();
}

function loadPolicyFromFile() {
  fetch("hotel.json")
    .then((res) => res.json())
    .then((data) => {
      const { title, policyItems } = data.hotel;
      document.getElementById("policy-title").textContent = title;
      const policyList = document.getElementById("policy-list");

      policyItems.forEach((item) => {
        const li = document.createElement("li");
        if (item.title) {
          li.innerHTML = `${item.title}: <ul>${item.cancellationItems
            .map((cancel) => `<li>${cancel}</li>`)
            .join("")}</ul>`;
        } else {
          li.textContent = item;
        }
        policyList.appendChild(li);
      });
    })
    .catch((err) => console.error("Error loading policy:", err));
}

window.onload = loadHotelDetails;
