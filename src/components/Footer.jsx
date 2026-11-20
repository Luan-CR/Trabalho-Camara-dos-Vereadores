export default function Footer({
  totalVisitas,
  ultimoAcesso,
  ultimoVereadorConsultado,
}) {
  return (
    <footer>
      <p>Câmara Municipal de Buriti do Codô - Rua Principal, 123 - Centro</p>
      <p id="info-acesso">
        Visitas registradas: {totalVisitas} | Último acesso: {ultimoAcesso} | Último
        parlamentar consultado: {ultimoVereadorConsultado}
      </p>
    </footer>
  );
}