let url = "https://api.potterdb.com/v1/characters?filter[name_cont]=";
let btn = document.getElementById("searchBtn");
let input = document.getElementById("searchInput");
let suggestionsList = document.getElementById("suggestions");

// 🧠 Fetch data from API
async function getData(name) {
  try {
    let res = await axios.get(url + name);
    return res.data;
  } catch (e) {
    console.log("Error:", e);
    return [];
  }
}

// 🎯 Main search logic
async function runSearch(name) {
  let resultsDiv = document.getElementById("results");
  let alerBox = document.getElementById("alerBox");
  let spinner = document.getElementById("spinner");
  let resultMessage = document.getElementById("resultMessage");

  resultsDiv.innerHTML = "";
  alerBox.innerHTML = "";
  spinner.innerHTML = "";
  suggestionsList.innerHTML = "";
  suggestionsList.style.display = "none";

  if (name === "") {
    alerBox.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Please enter a name before searching!
      </div>`;
    return;
  }

  spinner.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;

  let characters = await getData(name);
  let searchName = name.toLowerCase();

  let filteredCharacters = characters.data.filter(char => {
  const fullName = char.attributes.name.toLowerCase();
  return fullName.startsWith(searchName) || fullName.endsWith(searchName);
});


  spinner.innerHTML = "";

  if (filteredCharacters.length === 0) {
    resultsDiv.innerHTML = `
      <div class="alert alert-danger" role="alert">
        No character found for <strong>"${name}"</strong>.
      </div>`;
    resultMessage.innerHTML = "";
    return;
  }

  resultMessage.innerHTML = `
    <div class="result-box mt-3">
      Showing results for <strong>"${name}"</strong>
    </div>`;

  filteredCharacters.forEach(char => {
    const attr = char.attributes;

    let card = document.createElement("div");
    card.classList.add(
      "card",
      "p-3",
      "col-12",
      "col-sm-10",
      "col-md-6",
      "col-lg-4",
      "m-3",
      "text-center",
      "mx-auto"
    );
    card.style.width = "600px";
    card.style.backgroundColor = "rgba(241, 209, 209, 0.88)";

    card.innerHTML = `
      <h2>${attr.name}</h2>
      ${attr.image ? `<img src="${attr.image}" alt="${attr.name}" class="img-fluid character-img mb-2 mx-auto d-block"/>` : ""}
      <p><strong>House:</strong> ${attr.house || "Unknown"}</p>
      <p><strong>Born:</strong> ${attr.born || "Unknown"}</p>
      <p><strong>Nationality:</strong> ${attr.nationality || "Unknown"}</p>
      <p><strong>Blood Status:</strong> ${attr.blood_status || "Unknown"}</p>
      <p><strong>Patronus:</strong> ${attr.patronus || "Unknown"}</p>
      <p><strong>Species:</strong> ${attr.species || "Unknown"}</p>
      <p><strong>Boggart:</strong> ${attr.boggart || "Unknown"}</p>
      <p><strong>Wand:</strong> ${attr.wands || "Unknown"}</p>
      <p><strong>Marital Status:</strong> ${attr.marital_status || "Unknown"}</p>
      <p><a href="${attr.wiki}" target="_blank">View on Wiki</a></p>
    `;
    resultsDiv.appendChild(card);
  });
}

// 👆 Button Click
btn.addEventListener("click", () => {
  const name = input.value.trim();
  runSearch(name);
});

// ✨ Suggestion Handler
input.addEventListener("input", async () => {
  const query = input.value.trim();
  suggestionsList.innerHTML = "";
  if (query.length === 0) {
    suggestionsList.style.display = "none";
    return;
  }

  const data = await getData(query);
  const suggestions = new Set();

  data.data.forEach(char => {
    const name = char.attributes.name;
    if (name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(name);
    }
  });

  if (suggestions.size === 0) {
    suggestionsList.style.display = "none";
    return;
  }

  suggestions.forEach(name => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "list-group-item-action");
    li.textContent = name;
    suggestionsList.appendChild(li);
  });

  suggestionsList.style.display = "block";
});

// 🖱 Click on suggestion
suggestionsList.addEventListener("click", async (e) => {
  if (e.target.tagName === "LI") {
    const selectedName = e.target.innerText;
    input.value = selectedName;
    suggestionsList.innerHTML = "";
    suggestionsList.style.display = "none";
    await runSearch(selectedName);
  }
});
