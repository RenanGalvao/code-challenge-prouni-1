<div align="center">
  <a href="" rel="noopener">
 <img width="200px" height="200px" src="https://vuejs.org/logo.svg" alt="Project logo"></a>
</div>

<h1 align="center">Code Challenge ProUnion #1 - Frontend</h1>
<h2 align="center">Aplicação de Lista de Tarefas</h2>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![GitHub Issues](https://img.shields.io/github/issues/RenanGalvao/code-challenge-prounion-1.svg)](https://github.com/RenanGalvao/code-challenge-prounion-1/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/RenanGalvao/code-challenge-prounion-1.svg)](https://github.com/RenanGalvao/code-challenge-prounion-1/pulls)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
  
</div>

---

## Tabela de Conteúdos
- [Sobre](#sobre)
- [Requisitos](#requisitos)
- [Uso](#uso)
- [Principais Tecnologias](#tec)
- [Autor](#autor)


## Sobre <a name="sobre"></a>
A aplicação segue as orientações básicas do desafio. Foi feito como [SSR](https://vuejs.org/guide/scaling-up/ssr.html), isso significa que as páginas são inicialmente processadas pelo servidor e depois "hidratadas" no cliente. Apesar da proposta ser simples, busquei entregar um aplicativo com comportamento fluído:

- Ao apertar ``Enter`` abre o espaço para cadastrar uma nova tarefa, inclusive alternando de página se necessário
- Ao apagar todo o texto a tarefa automaticamente é apagada
- Não é permitido abrir mais de um espaço para cadastrar uma tarefa, sendo o usuário avisado no evento
- Antes de apagar uma tarefa, o usuário é questionado (se ela tiver conteúdo)
- As alterações na listagem das tarefas são feitas primeiramente no lado do cliente e só depois enviadas para a API

Note que apesar desse ser o desafio #1, na realidade fiz o desafio [#2](https://github.com/RenanGalvao/code-challenge-prounion-2) primeiro.

## Requisitos <a name="requisitos"></a>
- [NodeJS 21.x](https://nodejs.org/en/download/prebuilt-installer/current)


## Uso <a name="uso"></a>
- Primeiro clone o projeto: ``git clone https://github.com/RenanGalvao/code-challenge-prounion-1.git``
- Acesse a pasta clonada ``code-challenge-prounion-1``

### Desenvolvimento
- Navegue até a pasta ``frontend``
- Crie uma cópia do arquivo ``.env.example`` com o nome de ``.env``
- Instale os pacotes necessários ``npm install``
- Suba o aplicativo ``npm run dev``
- Acesse [http://localhost:3010](http://localhost:3010) pelo navegador

Note que se você não subir o [backend](../backend/README.md) também, serão apresentadas mensages de erro quando o aplicativo tentar fazer requisições à API.

### "Produção"
Inicie o projeto a partir do ``docker-compose.yml`` da pasta raiz.


## Principais Tecnologias <a name="tec"></a>
- [Docker](https://www.docker.com/) - Virtualização
- [NodeJs](https://nodejs.org/en/) - Runtime
- [VueJs](https://vuejs.org/) - Framework
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS


## Autor <a name="autor"></a>
[@RenanGalvao](https://renangalvao.github.io/whoami/)