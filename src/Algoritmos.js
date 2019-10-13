const localidades = [
  "CEN",
  "JAD",
  "GUR",
  "IND",
  "JSO",
  "VOL",
  "UNA",
  "NAC",
  "ABC",
  "BCD",
  "CDE",
  "DEF",
  "EFG",
  "FGH",
  "GHI",
  "HIJ"
];

const tipos = {
  1: "Subida de Encosta",
  2: "Tempera Simulada",
  3: "Algoritmo Genético"
};

function imprimir_paradas(info, paradas) {
  const { distancias, passageiros, pontos } = info;
  let tempo;
  let passageiros_aux = JSON.parse(JSON.stringify(passageiros));
  let passageiros_embarcados = 0;
  let resposta = [];

  for (var i = 0; i < paradas.length; i++) {
    let indice;
    let tipo;
    var tempo_excedente = "";

    i !== 0
      ? (tempo += distancias[`${pontos[paradas[i - 1]]}_${pontos[paradas[i]]}`])
      : (tempo = 0);

    if (paradas[i] < (pontos.length - 1) / 2) {
      indice = passageiros_aux.findIndex(
        // eslint-disable-next-line no-loop-func
        (x) => x.origem === pontos[paradas[i]]
      );
      tipo = "Embarcou";

      if (typeof passageiros_aux[indice].saiu === "undefined") {
        passageiros_aux[indice].saiu = tempo;
        passageiros_embarcados++;
      }
    } else {
      indice = passageiros_aux.findIndex(
        // eslint-disable-next-line no-loop-func
        (x) => x.destino === pontos[paradas[i]]
      );
      tipo = "Desembarcou";

      if (typeof passageiros_aux[indice].saiu !== "undefined") {
        passageiros_aux[indice].saiu = true;
        passageiros_embarcados--;
        const { chegada_esperada } = passageiros_aux[indice];

        tempo_excedente = tempo - chegada_esperada;
      }
    }

    let passageiro = passageiros_aux[indice].nome;
    let local = pontos[paradas[i]];

    //if (!passageiros_aux[indice].saiu) {
    resposta.push({
      passageiro,
      local,
      tipo,
      tempo,
      passageiros_embarcados,
      tempo_excedente
    });
    //}
  }
  return resposta;
}

function preenche_distancias() {
  let distancias = {};
  for (let i = 0; i < localidades.length - 1; i++) {
    for (let k = i + 1; k < localidades.length; k++) {
      let distancia = ramdonInt(5, 45);
      distancias[`${localidades[i]}_${localidades[k]}`] = distancia;
      distancias[`${localidades[k]}_${localidades[i]}`] = distancia;
    }
  }
  return distancias;
}

function preenche_passageiros(distancias) {
  var origens = [];
  var destinos = [];
  var localidades_aux = [...localidades];
  const nomes = [
    "Anderson",
    "Marcela",
    "Laís",
    "Marcos",
    "Fernando",
    "Andréia",
    "Lucas",
    "Katia"
  ];
  let passageiros = [];

  for (let i = 0; i < localidades.length / 2; i++) {
    let indice_origem = ramdonInt(0, localidades_aux.length - 1);
    let origem = localidades_aux[indice_origem];
    localidades_aux.splice(indice_origem, 1);
    origens.push(origem);

    let indice_destino = ramdonInt(0, localidades_aux.length - 1);
    let destino = localidades_aux[indice_destino];
    localidades_aux.splice(indice_destino, 1);
    destinos.push(destino);

    let chegada_esperada = ramdonInt(
      distancias[`${origem}_${destino}`],
      distancias[`${origem}_${destino}`] * 2
    );
    //criar hora de chamar o uber
    let nome = nomes[i];

    passageiros.push({
      nome,
      origem,
      destino,
      chegada_esperada
    });
  }

  let pontos = origens.concat(destinos);

  return { passageiros, pontos };
}

function resposta_random() {
  let resposta = [];
  let aux = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  for (let i = 0; i < localidades.length; i++) {
    let indice = ramdonInt(0, aux.length - 1);
    resposta.push(aux[indice]);
    aux.splice(indice, 1);
  }

  return resposta;
}

function custo(info, resposta) {
  const { distancias, passageiros, pontos } = info;
  var preco_total = 0;
  var tempo;
  let passageiros_aux = JSON.parse(JSON.stringify(passageiros));
  var passageiros_embarcados = 0;

  for (let i = 0; i < resposta.length; i++) {
    let indice;

    i !== 0
      ? (tempo +=
          distancias[`${pontos[resposta[i - 1]]}_${pontos[resposta[i]]}`])
      : (tempo = 0);

    if (resposta[i] < (pontos.length - 1) / 2) {
      indice = passageiros_aux.findIndex(
        // eslint-disable-next-line no-loop-func
        (x) => x.origem === pontos[resposta[i]]
      );

      if (typeof passageiros_aux[indice].saiu === "undefined") {
        passageiros_aux[indice].saiu = tempo;
        passageiros_embarcados++;

        // eslint-disable-next-line no-unused-expressions
        passageiros_embarcados > 4 ? (preco_total += 1000) : null;
      }
    } else {
      indice = passageiros_aux.findIndex(
        // eslint-disable-next-line no-loop-func
        (x) => x.destino === pontos[resposta[i]]
      );

      if (typeof passageiros_aux[indice].saiu === "undefined") {
        passageiros_aux[indice].saiu = "erro";
        preco_total += 2000;
      } else {
        passageiros_embarcados--;
        const { chegada_esperada } = passageiros_aux[indice];

        if (tempo > chegada_esperada) {
          let diff = tempo - chegada_esperada;
          if (diff > 0) {
            preco_total += diff * 2;
          }
        }
      }
    }
  }

  return preco_total;
}

function ramdonInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function subida_encosta(info) {
  var resposta = resposta_random();
  var encontrado = false;

  while (!encontrado) {
    let vizinhos = [];

    let escolhido = ramdonInt(0, resposta.length - 1);

    for (let i = 0; i < resposta.length; i++) {
      if (i !== escolhido) {
        let arr = [...resposta];
        [arr[i], arr[escolhido]] = [arr[escolhido], arr[i]];
        vizinhos.push(arr);
      }
    }

    let atual = custo(info, resposta);
    let melhor = atual;

    for (let i = 0; i < vizinhos.length; i++) {
      let custoaux = custo(info, vizinhos[i]);
      if (custoaux < melhor) {
        melhor = custoaux;
        resposta = JSON.parse(JSON.stringify(vizinhos[i]));
      }
    }

    melhor === atual ? (encontrado = true) : (encontrado = false);
  }

  return resposta;
}

function temp_sim(info, temp, resf) {
  var resposta = resposta_random();

  while (temp > 0.1) {
    let posicao_a = ramdonInt(0, resposta.length - 1);
    let posicao_b = ramdonInt(0, resposta.length - 1);

    while (posicao_a === posicao_b) {
      posicao_b = ramdonInt(0, resposta.length - 1);
    }

    let arr = JSON.parse(JSON.stringify(resposta));
    [arr[posicao_a], arr[posicao_b]] = [arr[posicao_b], arr[posicao_a]];

    let custo_resposta = custo(info, resposta);
    let custo_resposta_temp = custo(info, arr);
    let probabilidade = Math.pow(
      Math.E,
      (-custo_resposta_temp - custo_resposta) / temp
    );
    // eslint-disable-next-line no-unused-expressions
    custo_resposta_temp < custo_resposta || Math.random() < probabilidade
      ? (resposta = JSON.parse(JSON.stringify(arr)))
      : null;

    temp *= resf;
  }
  return resposta;
}

function mutacao(resposta) {
  let posicao_a = ramdonInt(0, resposta.length - 1);
  let posicao_b = ramdonInt(0, resposta.length - 1);

  while (posicao_a === posicao_b) {
    posicao_b = ramdonInt(0, resposta.length - 1);
  }

  var mut = JSON.parse(JSON.stringify(resposta));
  [mut[posicao_a], mut[posicao_b]] = [mut[posicao_b], mut[posicao_a]];

  return mut;
}

function cruzamento(i1, i2) {
  var aux = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  var individuo1 = JSON.parse(JSON.stringify(i1));
  var individuo2 = JSON.parse(JSON.stringify(i2));

  let posicao_a = ramdonInt(0, i1.length - 2);
  let posicao_b = ramdonInt(posicao_a + 1, i1.length - 1);

  var cruz = [];

  for (let i = 0; i < i1.length; i++) {
    if (i >= posicao_a && i <= posicao_b) {
      cruz[i] = individuo1[i];
      aux.splice(aux.indexOf(cruz[i]), 1);
    } else {
      cruz[i] = -1;
    }
  }

  for (let i = 0; i < i1.length; i++) {
    if ((i < posicao_a || i > posicao_b) && !cruz.includes(individuo2[i])) {
      cruz[i] = individuo2[i];
      aux.splice(aux.indexOf(cruz[i]), 1);
    }
  }

  for (let i = 0; i < i1.length; i++) {
    if (cruz[i] === -1) {
      cruz[i] = aux[0];
      aux.splice(0, 1);
    }
  }

  return cruz;
}

function genetico(info, tam_populacao, prob_mutacao, elit, num_geracoes) {
  var populacao = [];
  for (let i = 0; i < tam_populacao; i++) {
    let resposta = resposta_random();
    populacao.push([...resposta]);
  }

  var num_elit = elit * tam_populacao;
  var arr_custos = [];

  for (let i = 0; i < num_geracoes; i++) {
    arr_custos = [];
    for (let k = 0; k < populacao.length; k++) {
      arr_custos.push([custo(info, populacao[k]), [...populacao[k]]]);
    }
    arr_custos.sort((a, b) => a[0] - b[0]);

    let ind_ordenados = [];
    for (let j = 0; j < arr_custos.length; j++) {
      ind_ordenados.push(arr_custos[j][1]);
    }

    populacao = [...ind_ordenados.slice(0, num_elit)];

    while (populacao.length < tam_populacao) {
      if (Math.random() < prob_mutacao) {
        let indice_mutacao = ramdonInt(0, num_elit);
        populacao.push(mutacao(ind_ordenados[indice_mutacao]));
      } else {
        let cruzamento1 = ramdonInt(0, num_elit);
        let cruzamento2 = ramdonInt(0, num_elit);
        populacao.push(
          cruzamento(ind_ordenados[cruzamento1], ind_ordenados[cruzamento2])
        );
      }
    }
  }
  return arr_custos[0][1];
}

//Professor, aqui está a função que encontra os melhores parametros para o algoritmo genetico.
function best_genetico_aux(info) {
  var respostas = [];
  const populacao = [10, 15, 25, 30];
  const t_mutacao = [0.1, 0.2, 0.3, 0.4];
  const elitismo = [0.05, 0.1, 0.15, 0.2];
  const geracoes = [70, 100, 140, 170];

  for (let pop = 0; pop < populacao.length; pop++) {
    for (let mut = 0; mut < t_mutacao.length; mut++) {
      for (let elit = 0; elit < elitismo.length; elit++) {
        for (let ger = 0; ger < geracoes.length; ger++) {
          let entradas = {
            pop: populacao[pop],
            mut: t_mutacao[mut],
            elit: elitismo[elit],
            ger: geracoes[ger]
          };
          let resultado = genetico(
            info,
            populacao[pop],
            t_mutacao[mut],
            elitismo[elit],
            geracoes[ger]
          );
          respostas.push([custo(info, resultado), entradas, resultado]);
        }
      }
    }
  }

  respostas.sort((a, b) => a[0] - b[0]);

  var saida = [
    respostas[0][0],
    {
      melhor: respostas[0][2],
      custos: [respostas[0][0]],
      tipo: tipos[3]
    },
    { params: respostas[0][1] }
  ];
  return saida;
}

function busca_aux(
  tipo,
  repeticoes,
  info,
  func,
  param1,
  param2,
  param3,
  param4
) {
  var resultado = [],
    custos = [];
  for (let i = 0; i < repeticoes; i++) {
    let aux = func(info, param1, param2, param3, param4);
    resultado.push([custo(info, aux), aux]);
  }
  for (let i = 0; i < resultado.length; i++) {
    custos.push(resultado[i][0]);
  }
  resultado.sort((a, b) => a[0] - b[0]);

  var saida = [
    resultado[0][0],
    {
      melhor: resultado[0][1],
      custos: custos,
      tipo: tipos[tipo]
    }
  ];
  return saida;
}

export function executa_busca(inputs) {
  const {
    quantidade,
    sub_enc_checkbox,
    tem_sim_checkbox,
    genetic_checkbox,
    best_param,
    temp_tem_sim,
    resf_tem_sim,
    tam_populacao,
    prob_mutacao,
    elitismo,
    num_geracoes
  } = inputs;
  var resultados = [];
  var qtd_opcoes = 0;

  const distancias = preenche_distancias();
  const { passageiros, pontos } = preenche_passageiros(distancias);
  const info = { distancias, passageiros, pontos };

  if (sub_enc_checkbox) {
    qtd_opcoes++;
    resultados.push(busca_aux(1, quantidade, info, subida_encosta));
  }

  if (tem_sim_checkbox) {
    qtd_opcoes++;
    resultados.push(
      busca_aux(2, quantidade, info, temp_sim, temp_tem_sim, resf_tem_sim)
    );
  }

  if (genetic_checkbox && !best_param) {
    qtd_opcoes++;
    resultados.push(
      busca_aux(
        3,
        quantidade,
        info,
        genetico,
        tam_populacao,
        prob_mutacao,
        elitismo,
        num_geracoes
      )
    );
  } else if (genetic_checkbox && best_param) {
    qtd_opcoes++;
    resultados.push(best_genetico_aux(info));
  }

  var resultados_ordenados = [...resultados];
  resultados_ordenados.sort((a, b) => a[0] - b[0]);

  var labels = [];
  for (let i = 0; i < quantidade; i++) {
    labels.push((i + 1).toString());
  }

  var datasets = [];
  var ranking_caminhos = [];
  for (let i = 0; i < resultados_ordenados.length; i++) {
    datasets.push({
      label: resultados_ordenados[i][1].tipo,
      backgroundColor: null,
      borderColor: "white",
      borderWidth: 2,
      data: resultados_ordenados[i][1].custos
    });
    ranking_caminhos.push({
      cost: resultados_ordenados[i][0],
      type: resultados_ordenados[i][1].tipo,
      table: imprimir_paradas(info, resultados_ordenados[i][1].melhor)
    });
  }

  var saida = {
    ranking_caminhos: ranking_caminhos,
    grafico: {
      labels,
      datasets
    }
  };

  if (genetic_checkbox && best_param) {
    saida.params_genetico = resultados[qtd_opcoes - 1][2].params;
  }
  return saida;
}
