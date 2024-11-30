// Set today's date in the check-in date input
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkin").setAttribute("min", today);
});

// Event listeners for date inputs
document.getElementById("checkin").addEventListener("change", function () {
  validateDates();
  calculateNights();
});
document.getElementById("checkout").addEventListener("change", function () {
  validateDates();
  calculateNights();
});

function calculateNights() {
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const nightsInput = document.getElementById("nights");

  if (checkin && checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const timeDifference = checkoutDate - checkinDate;

    if (timeDifference > 0) {
      nightsInput.value = timeDifference / (1000 * 60 * 60 * 24);
    } else {
      nightsInput.value = 0;
    }
  } else {
    nightsInput.value = 0;
  }
}

function validateDates() {
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  if (checkin && checkout) {
    if (new Date(checkin) >= new Date(checkout)) {
      alert("Check-out date must be after check-in date.");
      document.getElementById("checkout").value = "";
    }
  }
}

function checkAvailability() {
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  if (checkin && checkout) {
    document.getElementById("resultsSection").style.display = "block";
    renderRooms();
  } else {
    alert("Please select both check-in and check-out dates.");
  }
}

function renderRooms() {
  const rooms = [
    { name: "Standard Room", price: 100, available: true, image: "room1.jpg" },
    { name: "Deluxe Room", price: 150, available: false, image: "room2.jpg" },
    {
      name: "Super Deluxe Room",
      price: 200,
      available: true,
      image: "room3.jpg",
    },
  ];

  // Sort rooms: available first, then sold-out rooms
  rooms.sort((a, b) =>
    a.available === b.available ? a.price - b.price : a.available ? -1 : 1
  );

  const roomContainer = document.getElementById("roomContainer");
  roomContainer.innerHTML = ""; // Clear any existing rooms

  rooms.forEach((room) => {
    const roomCard = document.createElement("div");
    roomCard.classList.add("room-card", "col-md-12");
    if (!room.available) roomCard.classList.add("room-soldout");

    roomCard.innerHTML = `
          <img src="${room.image}" alt="${
      room.name
    }" style="width: 100px; height: 70px;">
          <div>
              <h5>${room.name}</h5>
              <p>Price: $${
                room.price
              } per night for <span class="nights-count">${
      document.getElementById("nights").value
    }</span> nights</p>
              <select class="form-control meal-plan">
                  <option value="">Select Meal Plan</option>
                  <option value="none">No Meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="half-board">Half Board</option>
                  <option value="full-board">Full Board</option>
              </select>
          </div>
          <span class="remove-room" onclick="removeRoom(this)">✖</span>
      `;

    roomContainer.appendChild(roomCard);
  });
}

function removeRoom(element) {
  const roomDiv = element.closest(".room-card");
  roomDiv.remove();
}
// Function to switch tabs
function switchTab(event) {
  event.preventDefault();

  const targetTab = event.currentTarget;
  const targetPaneId = targetTab.getAttribute("data-bs-target");

  // Handle the tab switch logic
  const tabLinks = document.querySelectorAll(".nav-link");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabLinks.forEach((link) => {
    link.classList.remove("active");
    link.setAttribute("aria-selected", "false");
  });

  tabPanes.forEach((pane) => {
    pane.classList.remove("show", "active");
  });

  targetTab.classList.add("active");
  targetTab.setAttribute("aria-selected", "true");
  document.querySelector(targetPaneId).classList.add("show", "active");
}

// Add event listeners for click and touch events
const tabButtons = document.querySelectorAll(".nav-link");
tabButtons.forEach((button) => {
  button.addEventListener("click", switchTab);
  button.addEventListener("touchend", switchTab); // Handle touch events
});
