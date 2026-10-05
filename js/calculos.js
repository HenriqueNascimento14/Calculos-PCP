// ============================================================
// PCP CALC - CÁLCULOS GERAIS
// ============================================================


// ============================================================
// CONVERSÕES
// ============================================================

function mmParaMetros(valorMM) {
    return valorMM / 1000;
}

function cmParaMetros(valorCM) {
    return valorCM / 100;
}

function metrosParaCM(valorMetros) {
    return valorMetros * 100;
}

function gramasParaKg(valorGramas) {
    return valorGramas / 1000;
}


// ============================================================
// PESO DO FILME POR METRO
// ============================================================
//
// Fórmula:
//
// kg/m = densidade × largura(m) × espessura(µm) × 0.001
//
// Exemplo:
// PE
// densidade = 0.922
// largura = 550 mm
// espessura = 80 µm
//
// resultado ≈ 0.040568 kg/m
//
// ============================================================

function calcularKgPorMetroFilme(
    densidade,
    larguraMM,
    espessuraMicras
) {

    if (
        densidade <= 0 ||
        larguraMM <= 0 ||
        espessuraMicras <= 0
    ) {
        return 0;
    }

    const larguraMetros = mmParaMetros(larguraMM);

    return (
        densidade *
        larguraMetros *
        espessuraMicras *
        0.001
    );
}


// ============================================================
// METRAGEM A PARTIR DO PESO
// ============================================================
//
// metragem = peso / kg por metro
//
// ============================================================

function calcularMetragemPorPeso(
    pesoKg,
    kgPorMetro
) {

    if (
        pesoKg <= 0 ||
        kgPorMetro <= 0
    ) {
        return 0;
    }

    return pesoKg / kgPorMetro;
}


// ============================================================
// PESO A PARTIR DA METRAGEM
// ============================================================
//
// peso = metragem × kg/m
//
// ============================================================

function calcularPesoPorMetragem(
    metragem,
    kgPorMetro
) {

    if (
        metragem <= 0 ||
        kgPorMetro <= 0
    ) {
        return 0;
    }

    return metragem * kgPorMetro;
}


// ============================================================
// ÁREA DO FILME
// ============================================================
//
// área = largura × metragem
//
// Resultado em m²
//
// ============================================================

function calcularArea(
    larguraMM,
    metragem
) {

    if (
        larguraMM <= 0 ||
        metragem <= 0
    ) {
        return 0;
    }

    const larguraMetros = mmParaMetros(larguraMM);

    return larguraMetros * metragem;
}


// ============================================================
// TINTA
// ============================================================
//
// gramatura padrão:
// 1.5 g/m²
//
// peso tinta = área × gramatura
//
// ============================================================

function calcularPesoTinta(
    larguraMM,
    metragem,
    gramatura = 1.5
) {

    if (
        larguraMM <= 0 ||
        metragem <= 0 ||
        gramatura <= 0
    ) {
        return 0;
    }

    const area = calcularArea(
        larguraMM,
        metragem
    );

    const pesoGramas =
        area * gramatura;

    return gramasParaKg(pesoGramas);
}


// ============================================================
// ADESIVO
// ============================================================
//
// gramatura padrão:
// 2.0 g/m²
//
// O número de laminações pode ser:
//
// 1 = laminação simples
// 2 = dupla laminação
//
// ============================================================

function calcularPesoAdesivo(
    larguraMM,
    metragem,
    gramatura = 2.0,
    numeroLaminacoes = 1
) {

    if (
        larguraMM <= 0 ||
        metragem <= 0 ||
        gramatura <= 0 ||
        numeroLaminacoes <= 0
    ) {
        return 0;
    }

    const area = calcularArea(
        larguraMM,
        metragem
    );

    const pesoGramas =
        area *
        gramatura *
        numeroLaminacoes;

    return gramasParaKg(pesoGramas);
}


// ============================================================
// SACARIA
// ============================================================
//
// metragem necessária:
//
// quantidade de sacos × passo da fotocélula
//
// Exemplo:
//
// 10.000 sacos
// passo = 600 mm
//
// 10.000 × 0.600
//
// = 6.000 metros
//
// ============================================================

function calcularMetragemSacaria(
    quantidadeSacos,
    passoFotocelulaMM
) {

    if (
        quantidadeSacos <= 0 ||
        passoFotocelulaMM <= 0
    ) {
        return 0;
    }

    const passoMetros =
        mmParaMetros(passoFotocelulaMM);

    return quantidadeSacos * passoMetros;
}


// ============================================================
// ESTRUTURA COM VÁRIOS FILMES
// ============================================================
//
// Calcula quanto cada camada representa em kg/m.
//
// Exemplo:
//
// PET + PE
//
// PET:
// 12 µm
//
// PE:
// 70 µm
//
// Ambos precisam ter a mesma metragem.
//
// ============================================================

function calcularEstruturaFilmes(filmes) {

    if (
        !Array.isArray(filmes) ||
        filmes.length === 0
    ) {
        return [];
    }

    return filmes.map((filme) => {

        const kgPorMetro =
            calcularKgPorMetroFilme(
                filme.densidade,
                filme.larguraMM,
                filme.espessuraMicras
            );

        return {
            ...filme,
            kgPorMetro
        };
    });
}


// ============================================================
// KG/M TOTAL DA ESTRUTURA
// ============================================================

function calcularKgPorMetroEstrutura(filmes) {

    const estrutura =
        calcularEstruturaFilmes(filmes);

    return estrutura.reduce(
        (total, filme) =>
            total + filme.kgPorMetro,
        0
    );
}


// ============================================================
// KG/M DE TINTA
// ============================================================
//
// Permite incluir a tinta diretamente no cálculo
// da estrutura final.
//
// ============================================================

function calcularKgPorMetroTinta(
    larguraMM,
    gramatura = 1.5
) {

    if (
        larguraMM <= 0 ||
        gramatura <= 0
    ) {
        return 0;
    }

    const larguraMetros =
        mmParaMetros(larguraMM);

    return (
        larguraMetros *
        gramatura
    ) / 1000;
}


// ============================================================
// KG/M DE ADESIVO
// ============================================================

function calcularKgPorMetroAdesivo(
    larguraMM,
    gramatura = 2.0,
    numeroLaminacoes = 1
) {

    if (
        larguraMM <= 0 ||
        gramatura <= 0 ||
        numeroLaminacoes <= 0
    ) {
        return 0;
    }

    const larguraMetros =
        mmParaMetros(larguraMM);

    return (
        larguraMetros *
        gramatura *
        numeroLaminacoes
    ) / 1000;
}


// ============================================================
// METRAGEM DE PRODUTO LAMINADO
// ============================================================
//
// Todos os filmes precisam possuir a mesma metragem.
//
// A metragem é calculada usando:
//
// filmes
// +
// tinta
// +
// adesivo
//
// ============================================================

function calcularMetragemLaminado({
    pesoFinalKg,
    filmes,
    larguraMM,
    possuiTinta = false,
    gramaturaTinta = 1.5,
    numeroLaminacoes = 1,
    gramaturaAdesivo = 2.0
}) {

    if (
        pesoFinalKg <= 0 ||
        !Array.isArray(filmes) ||
        filmes.length === 0
    ) {
        return null;
    }

    const kgMetroFilmes =
        calcularKgPorMetroEstrutura(filmes);

    let kgMetroTinta = 0;

    if (possuiTinta) {
        kgMetroTinta =
            calcularKgPorMetroTinta(
                larguraMM,
                gramaturaTinta
            );
    }

    const kgMetroAdesivo =
        calcularKgPorMetroAdesivo(
            larguraMM,
            gramaturaAdesivo,
            numeroLaminacoes
        );

    const kgMetroTotal =
        kgMetroFilmes +
        kgMetroTinta +
        kgMetroAdesivo;

    if (kgMetroTotal <= 0) {
        return null;
    }

    const metragem =
        pesoFinalKg / kgMetroTotal;

    return {
        metragem,
        kgMetroFilmes,
        kgMetroTinta,
        kgMetroAdesivo,
        kgMetroTotal
    };
}


// ============================================================
// DISTRIBUIÇÃO DO PESO POR FILME
// ============================================================
//
// Depois que sabemos a metragem comum,
// conseguimos descobrir quantos kg serão necessários
// de cada filme.
//
// ============================================================

function calcularPesoDosFilmes(
    filmes,
    metragem
) {

    const estrutura =
        calcularEstruturaFilmes(filmes);

    return estrutura.map((filme) => ({
        ...filme,

        pesoKg:
            filme.kgPorMetro *
            metragem
    }));
}


// ============================================================
// PERCENTUAL
// ============================================================

function calcularPercentual(
    valor,
    total
) {

    if (total <= 0) {
        return 0;
    }

    return (
        valor / total
    ) * 100;
}


// ============================================================
// ACRESCENTAR PERDA
// ============================================================
//
// IMPORTANTE:
//
// Esta função NÃO altera a necessidade do pedido.
//
// Ela serve apenas para calcular quanto deve ser
// produzido/reservado para compensar uma perda.
//
// ============================================================

function calcularComPerda(
    necessidade,
    percentualPerda
) {

    if (necessidade <= 0) {
        return 0;
    }

    if (percentualPerda <= 0) {
        return necessidade;
    }

    return necessidade *
        (1 + percentualPerda / 100);
}


// ============================================================
// QUANTIDADE DA PERDA
// ============================================================

function calcularQuantidadePerda(
    necessidade,
    percentualPerda
) {

    const produzir =
        calcularComPerda(
            necessidade,
            percentualPerda
        );

    return produzir - necessidade;
}


// ============================================================
// FORMATAÇÃO
// ============================================================

function formatarNumero(
    valor,
    casas = 2
) {

    if (
        valor === null ||
        valor === undefined ||
        isNaN(valor)
    ) {
        return "0,00";
    }

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: casas,
                maximumFractionDigits: casas
            }
        );
}


function formatarKg(valor) {
    return `${formatarNumero(valor, 2)} kg`;
}


function formatarMetros(valor) {
    return `${formatarNumero(valor, 2)} m`;
}


function formatarMicras(valor) {
    return `${formatarNumero(valor, 0)} µm`;
}