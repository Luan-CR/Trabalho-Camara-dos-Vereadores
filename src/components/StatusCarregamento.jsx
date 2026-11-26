export default function StatusCarregamento({
  carregando,
  erro,
  mensagemCarregando = 'Carregando dados...',
}) {
  if (carregando) {
    return (
      <div className="info-contato" role="status" aria-live="polite">
        <p>{mensagemCarregando}</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="info-contato" role="alert">
        <p className="mensagem-feedback">{erro}</p>
      </div>
    );
  }

  return null;
}