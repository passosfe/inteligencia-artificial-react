import React from "react";
import "./App.css";
import Telas from "./Telas";

class App extends React.Component {
  state = { opcao: "opcao1" };

  changeView(item) {
    var oldItem = document.getElementById(this.state.opcao);
    oldItem.classList.remove("active");
    item.target.className = "item active";
    this.setState({ opcao: item.target.id });
  }

  render() {
    return (
      <div>
        <div>
          <h1>Trabalho de Inteligência Artificial</h1>
          <h3>Escolha a opção desejada:</h3>
          <div className="entradas">
            <div className="ui input">
              <input type="text" placeholder="Quantidade"></input>
            </div>
            <button className="ui button">Calcular</button>
          </div>
        </div>
        <div className="menu">
          <div className="ui five item menu">
            <a
              id="opcao1"
              className="item active"
              onClick={(param) => this.changeView(param)}
            >
              Subida de Encosta
            </a>
            <a
              id="opcao2"
              className="item"
              onClick={(param) => this.changeView(param)}
            >
              Subida de Encosta com Tentativas
            </a>
            <a
              id="opcao3"
              className="item"
              onClick={(param) => this.changeView(param)}
            >
              Têmpera Simulada
            </a>
            <a
              id="opcao4"
              className="item"
              onClick={(param) => this.changeView(param)}
            >
              Algoritmos Genéticos
            </a>
            <a
              id="opcao5"
              className="item"
              onClick={(param) => this.changeView(param)}
            >
              Análise
            </a>
          </div>
        </div>
        <div className="resultado">
          <Telas tipo={this.state.opcao}></Telas>
        </div>
      </div>
    );
  }
}

export default App;
