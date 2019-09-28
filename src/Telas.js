import React from "react";
import "./Telas.css";
import { executa_busca } from "./Algoritmos";

class Telas extends React.Component {
  busca_solucao(tipo) {
    let resultado = executa_busca(tipo);
    var items = resultado.melhores_horarios.map((item) => (
      <tr>
        <td>{item.nome}</td>
        <td>{item.origem}</td>
        <td>{item.ida_hora_saida}</td>
        <td>{item.ida_hora_chegada}</td>
        <td>{`R$${item.ida_preco},00`}</td>
        <td>{item.volta_hora_saida}</td>
        <td>{item.volta_hora_chegada}</td>
        <td>{`R$${item.volta_preco},00`}</td>
      </tr>
    ));

    return (
      <div>
        <table id="tabela" className="ui celled table">
          <thead>
            <th>Nome</th>
            <th>Origem</th>
            <th>Hora Ida (Saida)</th>
            <th>Hora Ida (Chegada)</th>
            <th>Preco Ida</th>
            <th>Hora Volta (Saida)</th>
            <th>Hora Volta (Chegada)</th>
            <th>Preco Volta</th>
          </thead>
          <tbody>{items}</tbody>
        </table>
        <div>{resultado.melhor_custo}</div>
      </div>
    );
  }

  selecionaTela() {
    switch (this.props.tipo) {
      case "opcao1":
        return <div>{this.busca_solucao(1)}</div>;
      case "opcao2":
        return <div>Em construcao</div>;
      case "opcao3":
        return <div>{this.busca_solucao(2)}</div>;
      case "opcao4":
        return <div>{this.busca_solucao(3)}</div>;
      default:
        return <div>{this.busca_solucao()}</div>;
    }
  }

  render() {
    return <div>{this.selecionaTela()}</div>;
  }
}

export default Telas;
