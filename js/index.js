const getStates = async () => {
  const url = "https://brasilapi.com.br/api/ibge/uf/v1";
  const response = await fetch(url);
  const states = await response.json();

  return states;
};

const removeRepeatedRegions = (regionsArray) => {
  const regionsNames = [];
  for (let i = 0; i < regionsArray.length; i++) {
    if (!regionsNames.includes(regionsArray[i])) {
      regionsNames.push(regionsArray[i]);
    }
  }
  return regionsNames;
};

const getAllRegions = async () => {
  const statesArray = await getStates();
  const regionsNamesArray = [];

  for (let i = 0; i < statesArray.length; i++) {
    regionsNamesArray.push(statesArray[i].regiao.nome);
  }
  const regionsNames = removeRepeatedRegions(regionsNamesArray);
  return regionsNames;
};

const getCitiesByState = async (stateAcronym) => {
  const baseURL = `https://brasilapi.com.br/api/ibge/municipios/v1/${stateAcronym}?providers=dados-abertos-br,gov,wikipedia`;
  const response = await fetch(baseURL);
  const cities = await response.json();

  return cities;
};

const showCitiesByState = async (stateAcronym) => {
  const citiesList = document.getElementById("cities-list");
  const citiesArray = await getCitiesByState(stateAcronym);

  citiesList.innerHTML = "";
  for (let i = 0; i < citiesArray.length; i++) {
    const cityButton = document.createElement("li");

    cityButton.textContent = citiesArray[i].nome;
    citiesList.appendChild(cityButton);
  }
};

const showStatesByRegion = async (event) => {
  const statesList = document.getElementById("states-list");
  const citiesList = document.getElementById("cities-list");
  const clickedElement = event.target;
  const regionToSearch = clickedElement.innerText;
  const states = await getStates();
  const filteredStates = states.filter((state) => {
    return state.regiao.nome === regionToSearch;
  });
  statesList.innerHTML = "";
  for (let i = 0; i < filteredStates.length; i++) {
    const stateButton = document.createElement("button");

    stateButton.addEventListener("click", (event) => {
      showCitiesByState(filteredStates[i].sigla);
    });
    stateButton.textContent = filteredStates[i].nome;
    statesList.appendChild(stateButton);
  }
  citiesList.innerHTML = "";
};

const main = async () => {
  const regionsNames = await getAllRegions();
  const regionsUl = document.getElementById("regions-list");

  for (let i = 0; i < regionsNames.length; i++) {
    const button = document.createElement("button");

    button.addEventListener("click", showStatesByRegion);
    button.textContent = regionsNames[i];
    regionsUl.appendChild(button);
  }
};
document.onload = main();
