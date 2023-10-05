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
  const URL = `https://brasilapi.com.br/api/ibge/municipios/v1/${stateAcronym}?providers=dados-abertos-br,gov,wikipedia`;
  const response = await fetch(URL);
  const cities = await response.json();

  return cities;
};

const showCitiesByState = async (stateAcronym) => {
  const citiesList = document.getElementById("cities__list");
  const citiesArray = await getCitiesByState(stateAcronym);
  const citiesTitle = document.querySelector(".cities__title");

  citiesList.innerHTML = "";
  citiesTitle.classList.remove("hidden");

  for (let i = 0; i < citiesArray.length; i++) {
    const cityLi = document.createElement("li");
    cityLi.classList.add("indicator");

    cityLi.textContent = citiesArray[i].nome;
    citiesList.appendChild(cityLi);
  }
};

const showStatesByRegion = async (event) => {
  const statesList = document.getElementById("states__list");
  const citiesList = document.getElementById("cities__list");
  const regionsTitle = document.querySelector(".states__title");
  const citiesTitle = document.querySelector(".cities__title");
  const clickedElement = event.target;
  const regionToSearch = clickedElement.innerText;
  const states = await getStates();
  const filteredStates = states.filter((state) => {
    return state.regiao.nome === regionToSearch;
  });

  statesList.innerHTML = "";
  regionsTitle.classList.remove("hidden");
  citiesTitle.classList.add("hidden");

  for (let i = 0; i < filteredStates.length; i++) {
    const stateLi = document.createElement("li");
    stateLi.classList.add("indicator");

    stateLi.addEventListener("click", (event) => {
      showCitiesByState(filteredStates[i].sigla);
    });
    stateLi.textContent = filteredStates[i].nome;
    statesList.appendChild(stateLi);
  }
  citiesList.innerHTML = "";
};

const main = async () => {
  const regionsNames = await getAllRegions();
  const regionsUl = document.getElementById("regions__list");

  for (let i = 0; i < regionsNames.length; i++) {
    const li = document.createElement("li");
    li.classList.add("indicator");

    li.addEventListener("click", showStatesByRegion);
    li.textContent = regionsNames[i];
    regionsUl.appendChild(li);
  }
};
document.onload = main();
