export default function validate(values) {
  const {
    quantidade,
    temp_tem_sim,
    resf_tem_sim,
    tam_populacao,
    prob_mutacao,
    elitismo,
    num_geracoes,
    tem_sim_checkbox,
    genetic_checkbox
  } = values;
  let errors = {};
  if (tem_sim_checkbox) {
    if (!temp_tem_sim) {
      errors.temp_tem_sim =
        "Temperatura da Têmpera Simulada não pode estar vazia";
    } else if (temp_tem_sim < 0) {
      errors.temp_tem_sim =
        "Temperatura da Têmpera Simulada não pode ser negativa";
    }
  }
  if (tem_sim_checkbox) {
    if (!resf_tem_sim) {
      errors.resf_tem_sim =
        "Resfriamento da Têmpera Simulada não pode estar vazia";
    } else if (resf_tem_sim <= 0 || resf_tem_sim >= 1) {
      errors.resf_tem_sim =
        "Resfriamento da Têmpera Simulada deve estar entre 0 e 1";
    }
  }
  if (genetic_checkbox) {
    if (!tam_populacao) {
      errors.tam_populacao =
        "Tamanho da População do Algoritmo Genético não pode estar vazia";
    } else if (tam_populacao < 0) {
      errors.tam_populacao =
        "Tamanho da População do Algoritmo Genético não pode ser menor que 0";
    }
  }
  if (genetic_checkbox) {
    if (!prob_mutacao) {
      errors.prob_mutacao =
        "Probabilidade de Mutação do Algoritmo Genético não pode estar vazia";
    } else if (prob_mutacao <= 0 || prob_mutacao >= 1) {
      errors.prob_mutacao =
        "Probabilidade de Mutação do Algoritmo Genético deve estar entre 0 e 1";
    }
  }
  if (genetic_checkbox) {
    if (!elitismo) {
      errors.elitismo = "Elitismo do Algoritmo Genético não pode estar vazia";
    } else if (elitismo <= 0 || elitismo >= 1) {
      errors.elitismo = "Elitismo do Algoritmo Genético deve estar entre 0 e 1";
    }
  }
  if (genetic_checkbox) {
    if (!num_geracoes) {
      errors.num_geracoes =
        "Número de Gerações do Algoritmo Genético não pode estar vazia";
    } else if (num_geracoes < 0) {
      errors.num_geracoes =
        "Número de Gerações do Algoritmo Genético não pode ser menor que 0";
    }
  }
  if (!quantidade) {
    errors.quantidade = "Quantidade de execuções não pode estar vazia";
  } else if (quantidade < 0) {
    errors.quantidade = "Quantidade de execuções não pode ser menor que 0";
  }
  return errors;
}
