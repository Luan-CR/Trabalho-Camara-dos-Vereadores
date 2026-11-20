export default function App() {
  return (
    <div>
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <header>
        <div className="cabecalho-container">
          <img
            src="/Imagens/Buriti-do-codo.png"
            id="BuritiLogo"
            alt="Brasão de Buriti do Codô"
          />
          <div className="cabecalho-texto">
            <h1>Câmara Municipal de Buriti do Codô</h1>
            <p id="subtitulo-camara">
              Trabalhando junto com a população por uma cidade melhor
            </p>
          </div>
        </div>
      </header>
      <div className="pagina-container">
        <main id="conteudo">
          <section>
            <h2>Portal Institucional SPA em Inicialização</h2>
            <p>
              Estrutura base configurada com Vite, React, Tailwind CSS, ESLint e Prettier.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}