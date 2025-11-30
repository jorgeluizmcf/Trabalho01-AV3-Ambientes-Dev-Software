// Informa ao ESLint que 'bootstrap' é uma variável global
/* exported showDetails */

// Objeto de constantes nomeadas para configurações da aplicação.
const CONFIG = {
  pageSize: 20, // Limite de pokémons por página.
  maxTypePokemons: 100, // Limite de pokémons no filtro por tipo.
  maxStat: 255, // Maximo possivel de stats.
  loadingSkeletons: 20, // Quantidade de skeletons exibidos.
};

// Variáveis de estado global
let pokemonCache = []; // Cache de todos os Pokémons carregados (seja por página ou tipo).
let currentPokemonList = []; // Lista de Pokémons atualmente exibida (pode ser filtrada).
let currentPage = 1; // Número da página atual.
let searchFilter = ''; // O valor do filtro de busca por nome/ID.
let typeFilter = ''; // O valor do filtro por tipo.

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';
const TYPE_API_URL = 'https://pokeapi.co/api/v2/type';

// Função: Renderiza a lista de Pokémons na grade, aplicando o filtro de busca.
function renderPokemonGrid() {
  const gridContainer = document.getElementById('pokemonGrid');
  gridContainer.innerHTML = '';

  let listToDisplay = currentPokemonList;
  if (searchFilter !== '') {
    listToDisplay = listToDisplay.filter(
      (pokemon) => pokemon.name.toLowerCase().includes(searchFilter.toLowerCase())
      || pokemon.id.toString().includes(searchFilter),
    );
  }

  for (let i = 0; i < listToDisplay.length; i += 1) {
    const pokemon = listToDisplay[i];
    const cardColumn = document.createElement('div');
    cardColumn.className = 'col-md-3';

    let cardHtml = `
            <div class="pokemon-card" onclick="showDetails(${pokemon.id})">
                <img src="${pokemon.sprites.front_default}" class="pokemon-image" alt="${pokemon.name}">
                <h5 class="text-center">#${pokemon.id} ${pokemon.name
  .charAt(0)
  .toUpperCase()}${pokemon.name.slice(1)}</h5>
                <div class="text-center">
        `;

    for (let j = 0; j < pokemon.types.length; j += 1) {
      const typeName = pokemon.types[j].type.name;
      cardHtml += `<span class="badge type-${typeName}">${typeName}</span> `;
    }

    cardHtml += '</div></div>';
    cardColumn.innerHTML = cardHtml;
    gridContainer.appendChild(cardColumn);
  }

  document.getElementById('loading').style.display = 'none';
  document.getElementById('pokemonGrid').style.display = 'flex';

  const pageInfoElement = document.getElementById('pageInfo');
  if (typeFilter !== '') {
    pageInfoElement.textContent = `Mostrando ${listToDisplay.length} pokémons`;
  } else {
    pageInfoElement.textContent = `Página ${currentPage}`;
  }

  // Desabilitar botões de navegação se estivermos filtrando por tipo
  document.getElementById('prevBtn').disabled = currentPage === 1 || typeFilter !== '';
  document.getElementById('nextBtn').disabled = typeFilter !== '';
}

// Função: Carrega os Pokémons por página (padrão da API).
async function loadPokemonPage() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('pokemonGrid').style.display = 'none';

  try {
    const offset = (currentPage - 1) * CONFIG.pageSize;
    const apiUrl = `${POKEMON_API_URL}?limit=${CONFIG.pageSize}&offset=${offset}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Array para armazenar as promessas de detalhes de cada Pokémon
    const detailPromises = [];
    for (let i = 0; i < data.results.length; i += 1) {
      detailPromises.push(fetch(data.results[i].url));
    }

    const responsesAll = await Promise.all(detailPromises);
    pokemonCache = [];

    // Mapeia as respostas para promessas de JSON e espera por todas de uma vez.
    const pokemonJsonPromises = responsesAll.map((res) => res.json());
    pokemonCache = await Promise.all(pokemonJsonPromises);

    currentPokemonList = [...pokemonCache];
    renderPokemonGrid();
  } catch (error) {
    console.error('Erro ao carregar a página de Pokémons:', error);
  }
}

// Função: Carrega Pokémons baseados no filtro de tipo.
async function loadPokemonByType() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('pokemonGrid').style.display = 'none';

  try {
    const apiUrl = `${TYPE_API_URL}/${typeFilter}`;
    const response = await fetch(apiUrl);
    const typeData = await response.json();

    const detailPromises = [];
    const limit = typeData.pokemon.length > CONFIG.maxTypePokemons
      ? CONFIG.maxTypePokemons
      : typeData.pokemon.length;

    for (let i = 0; i < limit; i += 1) {
      detailPromises.push(fetch(typeData.pokemon[i].pokemon.url));
    }

    const responsesAll = await Promise.all(detailPromises);
    pokemonCache = [];

    // Mapeia as respostas para promessas de JSON e espera por todas.
    const pokemonJsonPromises = responsesAll.map((res) => res.json());
    pokemonCache = await Promise.all(pokemonJsonPromises);

    currentPokemonList = [...pokemonCache];
    renderPokemonGrid();
  } catch (error) {
    console.error('Erro ao carregar Pokémons por tipo:', error);
  }
}

// Função: Inicializa a página, carregando esqueletos e o filtro de tipos.
async function initializePage() {
  document.getElementById('loading').innerHTML = '';

  // Adiciona os esqueletos de carregamento.
  for (let i = 0; i < CONFIG.loadingSkeletons; i += 1) {
    document.getElementById('loading').innerHTML
            += '<div class="col-md-3"><div class="skeleton-card"></div></div>';
  }

  try {
    const response = await fetch(TYPE_API_URL);
    const typeData = await response.json();
    const typeSelectElement = document.getElementById('typeFilter');

    // Popula o seletor de tipos.
    for (let i = 0; i < typeData.results.length; i += 1) {
      const option = document.createElement('option');
      const typeName = typeData.results[i].name;
      option.value = typeName;
      option.textContent = typeName.charAt(0).toUpperCase()
                + typeName.slice(1);
      typeSelectElement.appendChild(option);
    }
  } catch (err) {
    console.error('Erro ao inicializar filtros de tipo:', err);
  }

  loadPokemonPage();
}

// Função: Aplica os filtros de busca e tipo e recarrega os dados, se necessário.
/* exported */
async function applyFilters() {
  searchFilter = document.getElementById('searchBar').value;
  typeFilter = document.getElementById('typeFilter').value;

  if (typeFilter !== '') {
    // Se houver filtro por tipo, carrega os pokémons do tipo.
    await loadPokemonByType();
  } else {
    // Se não houver filtro de tipo, apenas aplica o filtro de busca na lista atual.
    renderPokemonGrid();
  }
}

// Função: Reseta todos os filtros e volta para a primeira página.
/* exported */
function resetFilters() {
  document.getElementById('searchBar').value = '';
  document.getElementById('typeFilter').value = '';
  searchFilter = '';
  typeFilter = '';
  currentPage = 1;
  loadPokemonPage();
}

// Função: Vai para a página anterior.
/* exported */
function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage -= 1;
    if (typeFilter !== '') {
      renderPokemonGrid();
    } else {
      loadPokemonPage();
    }
  }
}

// Função: Vai para a próxima página.
/* exported */
function goToNextPage() {
  currentPage += 1;
  if (typeFilter !== '') {
    renderPokemonGrid();
  } else {
    loadPokemonPage();
  }
}

// Função: Alterna entre o tema claro e escuro.
/* exported */
function toggleTheme() {
  document.body.classList.toggle('dark');
}

// Função: Exibe os detalhes de um Pokémon em um modal.
/* exported */
window.showDetails = async function showDetails(id) {
  try {
    const pokemonResponse = await fetch(`${POKEMON_API_URL}/${id}`);
    const pokemonData = await pokemonResponse.json();

    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    let description = '';
    // Busca a descrição em inglês.
    for (let i = 0; i < speciesData.flavor_text_entries.length; i += 1) {
      if (speciesData.flavor_text_entries[i].language.name === 'en') {
        description = speciesData.flavor_text_entries[i].flavor_text;
        break;
      }
    }

    document.getElementById('modalTitle').textContent = `#${pokemonData.id} ${pokemonData.name
      .charAt(0)
      .toUpperCase()}
        ${pokemonData.name.slice(1)}`;

    let modalContentHtml = '<div class="row"><div class="col-md-6">';
    modalContentHtml += '<div class="sprite-container">';
    modalContentHtml += `<div><img src="${pokemonData.sprites.front_default}" alt="front"><p class="text-center">Normal</p></div>`;
    modalContentHtml += `<div><img src="${pokemonData.sprites.front_shiny}" alt="shiny"><p class="text-center">Shiny</p></div>`;
    modalContentHtml += '</div>';

    modalContentHtml += '<p><strong>Tipo:</strong> ';
    for (let i = 0; i < pokemonData.types.length; i += 1) {
      modalContentHtml += `<span class="badge type-${pokemonData.types[i].type.name}">${pokemonData.types[i].type.name}</span> `;
    }
    modalContentHtml += '</p>';

    modalContentHtml += `<p><strong>Altura:</strong> ${pokemonData.height / 10} m</p>`;
    modalContentHtml += `<p><strong>Peso:</strong> ${pokemonData.weight / 10} kg</p>`;

    modalContentHtml += '<p><strong>Habilidades:</strong> ';
    for (let i = 0; i < pokemonData.abilities.length; i += 1) {
      modalContentHtml += pokemonData.abilities[i].ability.name;
      if (i < pokemonData.abilities.length - 1) modalContentHtml += ', ';
    }
    modalContentHtml += '</p>';

    modalContentHtml += '</div><div class="col-md-6">';
    modalContentHtml += '<p><strong>Descrição:</strong></p>';
    modalContentHtml += `<p>${description.replace(/\f/g, ' ')}</p>`;
    modalContentHtml += '<h6>Estatísticas:</h6>';

    // Exibe as barras de estatísticas.
    for (let i = 0; i < pokemonData.stats.length; i += 1) {
      const stat = pokemonData.stats[i];
      const percentage = (stat.base_stat / CONFIG.maxStat) * 100;
      modalContentHtml += `<div><small>${stat.stat.name}: ${stat.base_stat}</small>`;
      modalContentHtml += `<div class="stat-bar"><div class="stat-fill" style="width: ${percentage}%"></div></div></div>`;
    }

    modalContentHtml += '</div></div>';
    document.getElementById('modalBody').innerHTML = modalContentHtml;

    const modalElement = new bootstrap.Modal(document.getElementById('pokemonModal'));
    modalElement.show();
  } catch (error) {
    console.error('Erro ao exibir detalhes do Pokémon:', error);
  }
};

window.onload = () => {
  initializePage();
};

applyFilters();
resetFilters();
goToNextPage();
goToPreviousPage();
toggleTheme();
toggleTheme();
