# Trabalho01-AV3-Ambientes-Dev-Software

Repositório de trabalho para a disciplina de Ambientes de Desenvolvimento de Software (2025.02).

## 🚀 Aplicação no Ar (Deploy)

O projeto pode ser acessado em tempo real através do GitHub Pages no link abaixo:

**[https://jorgeluizmcf.github.io/Trabalho01-AV3-Ambientes-Dev-Software/](https://jorgeluizmcf.github.io/Trabalho01-AV3-Ambientes-Dev-Software/)**

Este deploy é automatizado via GitHub Actions sempre que um `push` é realizado para o branch `main`.

---

## 🎯 Objetivo do Projeto

O objetivo principal deste trabalho foi aplicar técnicas de **refatoração de código** em uma aplicação Pokédex existente.

O foco **não** foi alterar ou adicionar novas funcionalidades, mas sim melhorar a qualidade interna do código-fonte, visando maior legibilidade e manutenibilidade.

### Principais Ações de Refatoração

As seguintes melhorias foram implementadas:

* **Remoção de "Números Mágicos":** Valores literais (números soltos sem contexto) foram substituídos por constantes nomeadas para tornar o código autoexplicativo.
* **Princípio da Responsabilidade Única (SRP):** Funções que acumulavam múltiplas responsabilidades (ex: buscar dados e atualizar a tela) foram divididas em funções menores e mais focadas.
* **Melhoria na Legibilidade:** Nomes de variáveis e funções foram revisados para serem mais claros e descritivos, facilitando o entendimento do fluxo do código.

---

## 💻 Tecnologias

* HTML5
* CSS3
* JavaScript (ES6+)
* GitHub Actions (para CI/CD)

---

## 🤖 Prompts Utilizados

Para o cumprimento desta atividade, foram utilizados os seguintes Prompts:

* (jorgeluizmcf) https://gemini.google.com/share/b511033b0b8a
* (jorgeluizmcf) https://gemini.google.com/share/a1ab81557fb3