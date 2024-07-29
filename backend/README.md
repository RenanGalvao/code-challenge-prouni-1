<div align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://cdn.pixabay.com/photo/2021/03/27/06/31/code-6127616_1280.png" alt="Project logo"></a>
</div>

<h1 align="center">Code Challenge ProUnion #1 - Backend</h1>
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
- [Possíveis Erros](#erros)


## Sobre <a name="sobre"></a>
A API segue as orientações básicas do desafio. Procurei seguir as orientações do ExpressJS tanto na parte de [segurança](https://expressjs.com/en/advanced/best-practice-security.html) quanto na parte do [deploy](https://expressjs.com/en/advanced/best-practice-performance.html). Isso se traduziu em [Rate Limiting](https://www.cloudflare.com/pt-br/learning/bots/what-is-rate-limiting/) global e específico para rota de autenticação, [Logs](https://blog.vindi.com.br/logs-monitoramento/) espalhados pela aplicação, [Error Handling](https://www.tritondatacenter.com/node-js/production/design/errors) generalizado e outros ajustes menores. 

O banco de dados utilizado foi o SQLite por ser uma solução bastante conhecida e fácil de usar.

A organização da API foi inspirada nos projetos do NestJS onde existe módulo, controlador e serviço. As rotas são facilmente encontradas e o sufixo de muitos arquivos facilita a compreensão da função de cada um deles.

Comentei pouco pois tentei fazer o código o mais explícito o possível, certas partes vale o conhecimento da biblioteca em uso para uma compreensão melhor do que está sendo feito

Este desafio foi feito após o [Desafio 2](https://github.com/RenanGalvao/code-challenge-prounion-2), parte do código foi reaproveitado.


## Requisitos <a name="requisitos"></a>
- [NodeJS 21.x](https://nodejs.org/en/download/prebuilt-installer/current)
- [Python](https://www.python.org/downloads/) (sqlite3, node-gyp)


## Uso <a name="uso"></a>
- URL: http://localhost:3000

### Desenvolvimento
- Navegue até a pasta ``backend``
- Crie uma cópia do arquivo ``.env.example`` com o nome de ``.env``
- Instale os pacotes necessários ``npm install``
- Suba o servidor ``npm run dev``

### "Produção"
Inicie o projeto a partir do ``docker-compose.yml`` da pasta raiz.

### Rotas
- ``GET /tasks`` retorna a lista de tarefas cadastradas, aceita parâmetros de pesquisa ``page`` e ``itemsPerPage``, sendo ambos valores númericos.
- ``GET /tasks/:id`` retorna dados da tarefa associado ao id.
- ``POST /tasks`` cria uma nova tarefa e retorna seus dados, espera um JSON com a chave ``description`` apenas.
- ``PUT /tasks/:id`` atualiza e retorna os dados da tarefa associada ao id, o JSON esperado contém a mesma chave que o da criação, como existe apenas um campo (modificável) ele é obrigatório.
- ``DELETE /tasks/:id`` remove a tarefa associada ao id.


## Principais Tecnologias <a name="tec"></a>
- [SQLite](https://www.sqlite.org/index.html) - Banco de Dados
- [NodeJs](https://nodejs.org/en/) - Runtime
- [Express](https://expressjs.com/) - Framework


## Autor <a name="autor"></a>
[@RenanGalvao](https://renangalvao.github.io/whoami/)

## Possíveis Erros <a name="erros"></a>
- [Módulo distutils do Python faltando](https://pypi.org/project/setuptools/) (ver [problema com Python 3.12.x](https://stackoverflow.com/questions/77247893/modulenotfounderror-no-module-named-distutils-in-python-3-12))