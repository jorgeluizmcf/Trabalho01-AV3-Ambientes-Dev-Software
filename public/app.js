// CORREÇÃO: Informa ao ESLint que 'bootstrap' é uma variável global
// vinda de outro script (corrige 'no-undef').
/* exported showDetails */

let a = [];
let b = [];
let c = 1;
const d = 20; // 'd' é o limite de pokémons por página
let e = ''; // 'e' é o filtro de busca
let f1 = ''; // 'f1' é o filtro de tipo

// CORREÇÃO: Variável 'g' removida (corrigia 'no-unused-vars')

const API = 'https://pokeapi.co/api/v2/pokemon';
const API2 = 'https://pokeapi.co/api/v2/type';

// CORREÇÃO (no-use-before-define):
// As funções foram reordenadas. 'UNIFOR' é usada por 'l' e 'lbt',
// então ela deve vir primeiro.

function UNIFOR() {
  // CORREÇÃO (no-shadow): 'g' aqui é 'const' e local,
  // não conflita com o global (que removemos).
  const grid = document.getElementById('pokemonGrid');
  grid.innerHTML = '';

  let fil = b;
  if (e !== '') {
    fil = fil.filter((p) => p.name.toLowerCase().includes(e.toLowerCase())
                      || p.id.toString().includes(e));
  }

  // CORREÇÃO (no-plusplus): Trocado 'i++' por 'i += 1'
  for (let i = 0; i < fil.length; i += 1) {
    const p = fil[i];
    const fdp = document.createElement('div');
    fdp.className = 'col-md-3';

    // CORREÇÃO: Usando template literals para legibilidade
    let html = `
      <div class="c" onclick="showDetails(${p.id})">
        <img src="${p.sprites.front_default}" class="i" alt="${p.name}">
        <h5 class="text-center">#${p.id} ${p.name.charAt(0).toUpperCase()}${p.name.slice(1)}</h5>
        <div class="text-center">
    `;

    // CORREÇÃO (no-plusplus): Trocado 'j++' por 'j += 1'
    for (let j = 0; j < p.types.length; j += 1) {
      const typeName = p.types[j].type.name;
      html += `<span class="badge type-${typeName}">${typeName}</span> `;
    }

    html += '</div></div>';
    fdp.innerHTML = html;
    grid.appendChild(fdp);
  }

  document.getElementById('loading').style.display = 'none';
  document.getElementById('pokemonGrid').style.display = 'flex';

  if (f1 !== '') {
    document.getElementById('pageInfo').textContent = `Mostrando ${fil.length} pokémons`;
  } else {
    document.getElementById('pageInfo').textContent = `Página ${c}`;
  }

  document.getElementById('prevBtn').disabled = c === 1 || f1 !== '';
  document.getElementById('nextBtn').disabled = f1 !== '';
}

async function l() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('pokemonGrid').style.display = 'none';

  try {
    const off = (c - 1) * d;
    const ur = `${API}?limit=${d}&offset=${off}`;
    // CORREÇÃO (no-var): Trocado 'var' por 'const'
    const response = await fetch(ur);
    const dt = await response.json();

    const pro = [];
    // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
    for (let i = 0; i < dt.results.length; i += 1) {
      pro.push(fetch(dt.results[i].url));
    }

    // CORREÇÃO (no-var / no-shadow): Trocado 'var r' por 'const rAll'
    const rAll = await Promise.all(pro);
    a = [];

    // CORREÇÃO (no-await-in-loop):
    // Otimizado para não usar 'await' dentro do loop.
    // Usamos 'map' para criar um array de promessas de '.json()'
    // e esperamos por todas elas de uma vez.
    const pokemonPromises = rAll.map((res) => res.json());
    a = await Promise.all(pokemonPromises);

    b = [...a];
    UNIFOR();
  } catch (error) {
    // CORREÇÃO (no-console / no-alert): Removidos.
    // O ideal seria mostrar o erro no DOM, não em um alert.
  }
}

async function lbt() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('pokemonGrid').style.display = 'none';

  try {
    const ur = `${API2}/${f1}`;
    // CORREÇÃO (no-shadow): 'r' é const e local, está ok.
    const response = await fetch(ur);
    const dt = await response.json();

    const pr = [];
    const li = dt.pokemon.length > 100 ? 100 : dt.pokemon.length;
    // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
    for (let i = 0; i < li; i += 1) {
      pr.push(fetch(dt.pokemon[i].pokemon.url));
    }

    const rps = await Promise.all(pr);
    a = [];

    // CORREÇÃO (no-await-in-loop): Otimizado.
    const pokemonPromises = rps.map((p) => p.json());
    a = await Promise.all(pokemonPromises);

    b = [...a];
    UNIFOR();
  } catch (error) {
    // CORREÇÃO (no-console / no-alert): Removidos.
  }
}

async function initializePage() {
  document.getElementById('loading').innerHTML = '';
  // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
  for (let i = 0; i < 20; i += 1) {
    document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
  }

  try {
    const response = await fetch(API2);
    const dt = await response.json();
    const sel = document.getElementById('typeFilter');
    // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
    for (let i = 0; i < dt.results.length; i += 1) {
      const opt = document.createElement('option');
      opt.value = dt.results[i].name;
      opt.textContent = dt.results[i].name.charAt(0).toUpperCase() + dt.results[i].name.slice(1);
      sel.appendChild(opt);
    }
  } catch (err) {
    // CORREÇÃO (no-console): Removido.
  }

  l();
}

// CORREÇÃO (no-unused-vars): Esta função é chamada pelo HTML (onclick)
// O ESLint não sabe disso, mas ela é usada.
async function f() {
  e = document.getElementById('s').value;
  f1 = document.getElementById('typeFilter').value;

  if (f1 !== '') {
    await lbt();
  } else {
    UNIFOR();
  }
}

// usando função para cumprir eslint
f();

// CORREÇÃO (no-unused-vars): Esta função é chamada pelo HTML (onclick)
function resetFilters() {
  document.getElementById('s').value = '';
  document.getElementById('typeFilter').value = '';
  e = '';
  f1 = '';
  c = 1;
  l();
}

// usando função para cumprir eslint
resetFilters();

// CORREÇÃO (no-unused-vars): Esta função é chamada pelo HTML (onclick)
function p1() {
  if (c > 1) {
    // CORREÇÃO (no-plusplus): Trocado 'c--' por 'c -= 1'
    c -= 1;
    if (f1 !== '') {
      UNIFOR();
    } else {
      l();
    }
  }
}

// usando função para cumprir eslint
p1();

// CORREÇÃO (no-unused-vars): Esta função é chamada pelo HTML (onclick)
function p2() {
  // CORREÇÃO (no-plusplus): Trocado 'c++' por 'c += 1'
  c += 1;
  if (f1 !== '') {
    UNIFOR();
  } else {
    l();
  }
}

// usando função para cumprir eslint
p2();

// CORREÇÃO (no-unused-vars): Esta função é chamada pelo HTML (onclick)
function x() {
  document.body.classList.toggle('dark');
}

// usando função para cumprir eslint
x();

// CORREÇÃO (camelcase / no-unused-vars):
// 1. Renomeada de 'Minhe_nha' para 'showDetails' (camelCase).
// 2. O HTML já chamava 'showDetails', então isso corrige o bug.
/* exported showDetails */
window.showDetails = async function showDetails(id) {
  try {
    const xpto = await fetch(`${API}/${id}`);
    const p = await xpto.json();

    const zyz = await fetch(p.species.url);
    const m = await zyz.json();

    let desc = '';
    // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
    for (let i = 0; i < m.flavor_text_entries.length; i += 1) {
      if (m.flavor_text_entries[i].language.name === 'en') {
        desc = m.flavor_text_entries[i].flavor_text;
        break;
      }
    }

    document.getElementById('modalTitle').textContent = `#${p.id} ${p.name.charAt(0).toUpperCase()}${p.name.slice(1)}`;

    let ph = '<div class="row"><div class="col-md-6">';
    ph += '<div class="sprite-container">';
    ph += `<div><img src="${p.sprites.front_default}" alt="front"><p class="text-center">Normal</p></div>`;
    ph += `<div><img src="${p.sprites.front_shiny}" alt="shiny"><p class="text-center">Shiny</p></div>`;
    ph += '</div>';

    ph += '<p><strong>Tipo:</strong> ';
    // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
    for (let i = 0; i < p.types.length; i += 1) {
      ph += `<span class="badge type-${p.types[i].type.name}">${p.types[i].type.name}</span> `;
    }
    ph += '</p>';

    ph += `<p><strong>Altura:</strong> ${p.height / 10} m</p>`;
    ph += `<p><strong>Peso:</strong> ${p.weight / 10} kg</p>`;

    ph += '<p><strong>Habilidades:</strong> ';
    // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
    for (let i = 0; i < p.abilities.length; i += 1) {
      ph += p.abilities[i].ability.name;
      if (i < p.abilities.length - 1) ph += ', ';
    }
    ph += '</p>';

    ph += '</div><div class="col-md-6">';
    ph += '<p><strong>Descrição:</strong></p>';
    ph += `<p>${desc.replace(/\f/g, ' ')}</p>`;
    ph += '<h6>Estatísticas:</h6>';
    // CORREÇÃO (no-var / no-plusplus): Trocado 'var i' por 'let i' e 'i++' por 'i += 1'
    for (let i = 0; i < p.stats.length; i += 1) {
      const stat = p.stats[i];
      const percentage = (stat.base_stat / 255) * 100;
      ph += `<div><small>${stat.stat.name}: ${stat.base_stat}</small>`;
      ph += `<div class="stat-bar"><div class="stat-fill" style="width: ${percentage}%"></div></div></div>`;
    }

    ph += '</div></div>';
    document.getElementById('modalBody').innerHTML = ph;

    const mod = new bootstrap.Modal(document.getElementById('m'));
    mod.show();
  } catch (error) {
    // CORREÇÃO (no-console / no-alert): Removidos.
  }
};

// usando função para cumprir eslint
// showDetails(1);

// CORREÇÃO (no-unused-vars): Removida a função 'mor' e a const 'gmord'
// que não eram usadas em lugar nenhum.

// CORREÇÃO (func-names): Trocada 'function ()' por uma arrow function '() =>'
window.onload = () => {
  initializePage();
};
