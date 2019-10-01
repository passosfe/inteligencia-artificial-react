import { testNameToKey } from "jest-snapshot/build/utils";
import { Object } from "core-js";

const voos_file = require("./Voos");

const pessoas = [
  { nome: "Amanda", origem: "CWB" },
  { nome: "Pedro", origem: "GIG" },
  { nome: "Marcos", origem: "POA" },
  { nome: "Joana", origem: "FLN" },
  { nome: "Marcia", origem: "CNF" },
  { nome: "Paulo", origem: "GYN" }
];

const destino = "GRU";
const voos = voos_file.voos;

const tipos = {
  1: "Subida de Encosta",
  2: "Tempera Simulada",
  3: "Algoritmo Genetico"
};

function preencheDominio() {
  let dom = [];
  for (var i = 0; i < pessoas.length * 2; i++) {
    dom.push([0, 9]);
  }
  return dom;
}

function imprimir_horarios(horarios) {
  var voo = -1;
  var resposta = [];

  for (var i = 0; i < horarios.length / 2; i++) {
    const { nome, origem } = pessoas[i];
    voo += 1;
    let ida = voos[`${origem}_${destino}`][horarios[voo]];
    voo += 1;
    let volta = voos[`${destino}_${origem}`][horarios[voo]];
    resposta.push({
      nome: nome,
      origem: origem,
      ida_hora_saida: ida.hora_saida,
      ida_hora_chegada: ida.hora_chegada,
      ida_preco: ida.preco,
      volta_hora_saida: volta.hora_saida,
      volta_hora_chegada: volta.hora_chegada,
      volta_preco: volta.preco
    });
  }
  return resposta;
}

//Converte hora para minutos
function convMin(hora) {
  const aux = hora.split(":");
  var min = aux[0] * 60;
  min += aux[1] / 1;
  return min;
}

function custo(resposta) {
  var preco_total = 0;
  var ultima_chegada = 0;
  var primeira_partida = 1439; //total de minutos em um dia

  var voo = -1;
  for (let i = 0; i < resposta.length / 2; i++) {
    const { origem } = pessoas[i];
    voo += 1;
    let ida = voos[`${origem}_${destino}`][resposta[voo]];
    voo += 1;
    let volta = voos[`${destino}_${origem}`][resposta[voo]];

    preco_total += ida.preco;
    preco_total += volta.preco;

    // eslint-disable-next-line no-unused-expressions
    ultima_chegada < convMin(ida.hora_chegada)
      ? (ultima_chegada = convMin(ida.hora_chegada))
      : null;

    // eslint-disable-next-line no-unused-expressions
    primeira_partida > convMin(volta.hora_saida)
      ? (primeira_partida = convMin(volta.hora_saida))
      : null;
  }

  var total_epera = 0;
  voo = -1;
  for (let k = 0; k < resposta.length / 2; k++) {
    const { origem } = pessoas[k];
    voo += 1;
    let ida = voos[`${origem}_${destino}`][resposta[voo]];
    voo += 1;
    let volta = voos[`${destino}_${origem}`][resposta[voo]];

    total_epera += ultima_chegada - convMin(ida.hora_chegada);
    total_epera += convMin(volta.hora_saida) - primeira_partida;

    // eslint-disable-next-line no-unused-expressions
    ultima_chegada > primeira_partida ? (preco_total += 50) : null;

    return preco_total + total_epera;
  }
}

function ramdonInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function subida_encosta(dominio) {
  var resposta = [];
  for (let i = 0; i < dominio.length; i++) {
    resposta.push(ramdonInt(dominio[i][0], dominio[i][1]));
  }
  var encontrado = false;

  while (!encontrado) {
    let vizinhos = [];

    for (let i = 0; i < dominio.length; i++) {
      if (resposta[i] >= dominio[i][0] && resposta[i] != dominio[i][1]) {
        let aux = [...resposta];
        aux[i]++;
        vizinhos.push(aux);
      }
      if (resposta[i] <= dominio[i][1] && resposta[i] != dominio[i][0]) {
        let aux = [...resposta];
        aux[i]--;
        vizinhos.push(aux);
      }
    }

    let atual = custo(resposta);
    let melhor = atual;

    for (let i = 0; i < vizinhos.length; i++) {
      let custoaux = custo(vizinhos[i]);
      if (custoaux < melhor) {
        melhor = custoaux;
        resposta = [...vizinhos[i]];
      }
    }

    melhor == atual ? (encontrado = true) : (encontrado = false);
  }

  return resposta;
}

function temp_sim(dominio, temp, resf, taxa) {
  var resposta = [];
  for (let i = 0; i < dominio.length; i++) {
    resposta.push(ramdonInt(dominio[i][0], dominio[i][1]));
  }

  while (temp > 0.1) {
    let i = ramdonInt(0, dominio.length - 1);
    let direcao = ramdonInt(-taxa, taxa);

    let resp_temp = [...resposta];
    resp_temp[i] += direcao;

    if (resp_temp[i] < dominio[i][0]) {
      resp_temp[i] = dominio[i][0];
    } else if (resp_temp[i] > dominio[i][1]) {
      resp_temp[i] = dominio[i][0];
    }

    let custo_resposta = custo(resposta);
    let custo_resposta_temp = custo(resp_temp);
    let probabilidade = Math.pow(
      Math.E,
      (-custo_resposta_temp - custo_resposta) / temp
    );
    // eslint-disable-next-line no-unused-expressions
    custo_resposta_temp < custo_resposta || Math.random() < probabilidade
      ? (resposta = [...resp_temp])
      : null;

    temp *= resf;
  }
  return resposta;
}

function mutacao(dominio, taxa, resposta) {
  var i = ramdonInt(0, dominio.length - 1);
  var mut = [...resposta];

  if (Math.random() < 0.5) {
    if (resposta[i] != dominio[i][0]) {
      let aux = [...resposta];
      aux[i] -= taxa;
      mut = [...aux];
    }
  } else {
    if (resposta[i] != dominio[i][1]) {
      let aux = [...resposta];
      aux[i] += taxa;
      mut = [...aux];
    }
  }
  return mut;
}

function cruzamento(dominio, individuo1, individuo2) {
  var i = ramdonInt(1, dominio.length - 2);
  return [...individuo1.slice(0, i), ...individuo2.slice(i, individuo2.length)];
}

function genetico(
  dominio,
  tam_populacao,
  taxa,
  prob_mutacao,
  elit,
  num_geracoes
) {
  var populacao = [];
  for (let i = 0; i < tam_populacao; i++) {
    let resposta = [];
    for (let k = 0; k < dominio.length; k++) {
      resposta.push(ramdonInt(dominio[k][0], dominio[k][1]));
    }
    populacao.push([...resposta]);
  }

  var num_elit = elit * tam_populacao;
  var arr_custos = [];

  for (let i = 0; i < num_geracoes; i++) {
    arr_custos = [];
    for (let k = 0; k < populacao.length; k++) {
      arr_custos.push([custo(populacao[k]), [...populacao[k]]]);
    }
    arr_custos.sort();

    let ind_ordenados = [];
    for (let j = 0; j < arr_custos.length; j++) {
      ind_ordenados.push(arr_custos[j][1]);
    }

    populacao = [...ind_ordenados.slice(0, num_elit)];

    while (populacao.length < tam_populacao) {
      if (Math.random() < prob_mutacao) {
        let indice_mutacao = ramdonInt(0, num_elit);
        populacao.push(mutacao(dominio, taxa, ind_ordenados[indice_mutacao]));
      } else {
        let cruzamento1 = ramdonInt(0, num_elit);
        let cruzamento2 = ramdonInt(0, num_elit);
        populacao.push(
          cruzamento(
            dominio,
            ind_ordenados[cruzamento1],
            ind_ordenados[cruzamento2]
          )
        );
      }
    }
  }
  return arr_custos[0][1];
}

function busca_aux(
  tipo,
  repeticoes,
  dominio,
  func,
  param1,
  param2,
  param3,
  param4,
  param5
) {
  var resultado = [],
    custos = [];
  for (let i = 0; i < repeticoes; i++) {
    let aux = func(dominio, param1, param2, param3, param4, param5);
    resultado.push([custo(aux), aux]);
  }
  for (let i = 0; i < resultado.length; i++) {
    custos.push(resultado[i][0]);
  }
  resultado.sort();

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
    temp_tem_sim,
    resf_tem_sim,
    tam_populacao,
    prob_mutacao,
    elitismo,
    num_geracoes
  } = inputs;
  let dominio = preencheDominio();
  var resultados = [];

  if (sub_enc_checkbox) {
    resultados.push(busca_aux(1, quantidade, dominio, subida_encosta));
  }

  if (tem_sim_checkbox) {
    resultados.push(
      busca_aux(2, quantidade, dominio, temp_sim, temp_tem_sim, resf_tem_sim, 1)
    );
  }

  if (genetic_checkbox) {
    resultados.push(
      busca_aux(
        3,
        quantidade,
        dominio,
        genetico,
        tam_populacao,
        1,
        prob_mutacao,
        elitismo,
        num_geracoes
      )
    );
  }

  var resultados_ordenados = [...resultados];
  resultados_ordenados.sort();

  var labels = [];
  for (let i = 0; i < quantidade; i++) {
    labels.push((i + 1).toString());
  }

  var datasets = [];
  var ranking_horarios = [];
  for (let i = 0; i < resultados_ordenados.length; i++) {
    datasets.push({
      label: resultados_ordenados[i][1].tipo,
      backgroundColor: null,
      borderColor: "white",
      borderWidth: 2,
      data: resultados_ordenados[i][1].custos
    });
    ranking_horarios.push({
      cost: resultados_ordenados[i][0],
      type: resultados_ordenados[i][1].tipo,
      table: imprimir_horarios(resultados_ordenados[i][1].melhor)
    });
  }

  var saida = {
    ranking_horarios: ranking_horarios,
    grafico: {
      labels: labels,
      datasets: datasets
    }
  };
  return saida;
}
