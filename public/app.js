/* exported showDetails */

// ==============================
// CONFIG
// ==============================
const CONFIG = {
  pageSize: 20,
  maxTypePokemons: 100,
  maxStat: 255,
  loadingSkeletons: 20,
};

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';
const TYPE_API_URL = 'https://pokeapi.co/api/v2/type';

// ==============================
// ESTADO GLOBAL
// ==============================
let pokemonCache = [];
let currentPokemonList = [];
let currentPage = 1;
let searchFilter = '';
let typeFilter = '';

// ==============================
// DATA LAYER (APENAS FETCH)
// ==============================

async function fetchPokemonPage(page, limit) {
  const offset = (page - 1) * limit;
  const res = await fetch(`${POKEMON_API_URL}?limit=${limit}&offset=${offset}`);
  return res.json();
}

async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  return res.json();
}

async function fetchPokemonByType(type) {
  const res = await fetch(`${TYPE_API_URL}/${type}`);
  return res.json();
}

async function fetchPokemon(id) {
  const res = await fetch(`${POKEMON_API_URL}/${id}`);
  return res.json();
}

async function fetchSpecies(url) {
  const res = await fetch(url);
  return res.json();
}

// ==============================
// VIEW LAYER (SOMENTE DOM)
// ==============================

function showLoading() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('pokemonGrid').style.display = 'none';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('pokemonGrid').style.display = 'flex';
}

function renderPokemonCard(pokemon) {
  const col = document.createElement('div');
  col.className = 'col-md-3';

  const types = pokemon.types
    .map((t) => `<span class="badge type-${t.type.name}">${t.type.name}</span>`)
    .join(' ');

  col.innerHTML = `
    <div class="pokemon-card" onclick="showDetails(${pokemon.id})">
      <img src="${pokemon.sprites.front_default}" class="pokemon-image" alt="${pokemon.name}">
      <h5 class="text-center">#${pokemon.id} ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h5>
      <div class="text-center">${types}</div>
    </div>
  `;

  return col;
}

function renderPokemonGrid(list) {
  const grid = document.getElementById('pokemonGrid');
  grid.innerHTML = '';

  list.forEach((p) => grid.appendChild(renderPokemonCard(p)));

  const pageInfo = document.getElementById('pageInfo');
  if (typeFilter !== '') {
    pageInfo.textContent = `Mostrando ${list.length} pokémons`;
  } else {
    pageInfo.textContent = `Página ${currentPage}`;
  }

  document.getElementById('prevBtn').disabled = currentPage === 1 || typeFilter !== '';
  document.getElementById('nextBtn').disabled = typeFilter !== '';

  hideLoading();
}

function renderTypeOptions(typeList) {
  const select = document.getElementById('typeFilter');

  typeList.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t.name;
    opt.textContent = t.name[0].toUpperCase() + t.name.slice(1);
    select.appendChild(opt);
  });
}

function renderModal({ pokemon, species }) {
  const modalTitle = document.getElementById('modalTitle');
  modalTitle.textContent = `#${pokemon.id} ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}`;

  const descriptionEntry = species.flavor_text_entries.find(
    (e) => e.language.name === 'en',
  );
  const description = descriptionEntry ? descriptionEntry.flavor_text.replace(/\f/g, ' ') : '';

  let html = `
    <div class="row">
      <div class="col-md-6">
        <div class="sprite-container">
          <div><img src="${pokemon.sprites.front_default}" alt="normal"><p class="text-center">Normal</p></div>
          <div><img src="${pokemon.sprites.front_shiny}" alt="shiny"><p class="text-center">Shiny</p></div>
        </div>
        <p><strong>Tipo:</strong> 
  `;

  html += pokemon.types
    .map((t) => `<span class="badge type-${t.type.name}">${t.type.name}</span>`)
    .join(' ');

  html += `
        </p>
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Habilidades:</strong> 
        ${pokemon.abilities.map((a) => a.ability.name).join(', ')}
        </p>
      </div>

      <div class="col-md-6">
        <p><strong>Descrição:</strong></p>
        <p>${description}</p>
        <h6>Estatísticas:</h6>
  `;

  pokemon.stats.forEach((s) => {
    const pct = (s.base_stat / CONFIG.maxStat) * 100;
    html += `
      <div>
        <small>${s.stat.name}: ${s.base_stat}</small>
        <div class="stat-bar"><div class="stat-fill" style="width: ${pct}%;"></div></div>
      </div>`;
  });

  html += '</div></div>';

  document.getElementById('modalBody').innerHTML = html;

  const modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
  modal.show();
}

// ==============================
// CONTROLLER LAYER
// ==============================

function filterBySearch(list, text) {
  if (!text) return list;

  return list.filter(
    (p) => p.name.toLowerCase().includes(text.toLowerCase())
      || p.id.toString().includes(text),
  );
}

async function loadPokemonPageController() {
  showLoading();

  const data = await fetchPokemonPage(currentPage, CONFIG.pageSize);

  const details = await Promise.all(
    data.results.map((i) => fetchPokemonDetails(i.url)),
  );

  pokemonCache = [...details];
  currentPokemonList = [...pokemonCache];

  renderPokemonGrid(currentPokemonList);
}

async function loadPokemonByTypeController() {
  showLoading();

  const data = await fetchPokemonByType(typeFilter);

  const limit = Math.min(CONFIG.maxTypePokemons, data.pokemon.length);
  const detailRequests = data.pokemon
    .slice(0, limit)
    .map((p) => fetchPokemonDetails(p.pokemon.url));
  const details = await Promise.all(detailRequests);

  pokemonCache = [...details];
  currentPokemonList = [...details];

  renderPokemonGrid(currentPokemonList);
}

async function applyFilters() {
  searchFilter = document.getElementById('searchBar').value;
  typeFilter = document.getElementById('typeFilter').value;

  if (typeFilter) {
    await loadPokemonByTypeController();
  } else {
    const filtered = filterBySearch(currentPokemonList, searchFilter);
    renderPokemonGrid(filtered);
  }
}

function resetFilters() {
  searchFilter = '';
  typeFilter = '';
  currentPage = 1;

  document.getElementById('searchBar').value = '';
  document.getElementById('typeFilter').value = '';

  loadPokemonPageController();
}

function goToPreviousPage() {
  if (currentPage > 1 && !typeFilter) {
    currentPage -= 1;
    loadPokemonPageController();
  }
}

function goToNextPage() {
  if (!typeFilter) {
    currentPage += 1;
    loadPokemonPageController();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

// ==============================
// DETALHES DO POKEMON
// ==============================

window.showDetails = async function showDetails(id) {
  try {
    const pokemon = await fetchPokemon(id);
    const species = await fetchSpecies(pokemon.species.url);
    renderModal({ pokemon, species });
  } catch (err) {
    console.error('Erro ao exibir detalhes:', err);
  }
};

// ==============================
// INIT
// ==============================

async function initializePage() {
  const loading = document.getElementById('loading');
  loading.innerHTML = '';

  for (let i = 0; i < CONFIG.loadingSkeletons; i++) {
    loading.innerHTML += '<div class="col-md-3"><div class="skeleton-card"></div></div>';
  }

  try {
    const res = await fetch(TYPE_API_URL);
    const data = await res.json();
    renderTypeOptions(data.results);
  } catch (err) {
    console.error('Erro ao carregar tipos:', err);
  }

  loadPokemonPageController();
}

window.onload = initializePage;

applyFilters();
resetFilters();
goToNextPage();
goToPreviousPage();
toggleTheme();
toggleTheme();
