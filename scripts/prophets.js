const requestURL = "/prophets.json"; // Replace with actual JSON URL
const cardsContainer = document.querySelector("#cards-container");

async function getProphetsData() {
    try {
        const response = await fetch(requestURL);
        const data = await response.json();
        displayProphets(data.prophets);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayProphets(prophets) {
    const template = document.querySelector("#prophet-card");

    prophets.forEach((prophet) => {
        // Clone the template
        const clone = template.content.cloneNode(true);

        // Populate the template with data
        clone.querySelector("h2").textContent = `${prophet.name} ${prophet.lastname}`;
        clone.querySelector(".birthdate").textContent = `Birthdate: ${prophet.birthdate}`;
        clone.querySelector(".birthplace").textContent = `Birthplace: ${prophet.birthplace}`;
        
        const image = clone.querySelector(".profile");
        image.src = prophet.imageurl;
        image.alt = `Portrait of ${prophet.name} ${prophet.lastname}`;

        // Append the populated template to the container
        cardsContainer.appendChild(clone);
    });
}

// Fetch and display prophets data
getProphetsData();
