export async function requisitarJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const textoErro = await response.text().catch(() => '');
      throw new Error(
        `Erro HTTP ${response.status}: ${textoErro || response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error(`Falha na requisição assíncrona para ${url}:`, error.message);
    throw error;
  }
}

export async function buscarDadosCamara(signal) {
  return await requisitarJson('/data/camara.json', { signal });
}

export async function buscarVereadores(signal) {
  return await requisitarJson('/data/vereadores.json', { signal });
}

export async function buscarVereadorPorId(id, signal) {
  const lista = await buscarVereadores(signal);
  const vereador = lista.find((item) => item.id === id) || null;
  return { vereador, todosVereadores: lista };
}

export async function buscarNoticias(signal) {
  return await requisitarJson('/data/noticias.json', { signal });
}

export async function buscarNoticiaPorId(id, signal) {
  const lista = await buscarNoticias(signal);
  const noticia = lista.find((item) => item.id === id) || null;
  return { noticia, todasNoticias: lista };
}

export async function buscarSessoes(signal) {
  return await requisitarJson('/data/sessoes.json', { signal });
}