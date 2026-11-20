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

export async function buscarNoticias(signal) {
    return await requisitarJson('/data/noticias.json', { signal });
}

export async function buscarSessoes(signal) {
    return await requisitarJson('/data/sessoes.json', { signal });
}