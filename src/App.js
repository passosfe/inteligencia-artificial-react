import React from "react";
import "./App.css";
import { executa_busca } from "./Algoritmos";
import Entradas from "./Entradas";
import { Line } from "react-chartjs-2";
import TableView from "./TableView";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grafico: {
        labels: [],
        datasets: []
      },
      results: [],
      visible: true
    };

    this.busca_solucao = this.busca_solucao.bind(this);
  }

  busca_solucao(qtd) {
    let resultado = executa_busca(qtd);

    this.setState(
      {
        results: resultado.ranking_caminhos
      },
      () => {
        this.setState({
          grafico: {
            labels: resultado.grafico.labels,
            datasets: resultado.grafico.datasets
          }
        });
      }
    );
  }

  setGradientColor = (canvas, topcolor, bottomcolor) => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
    gradient.addColorStop(0, bottomcolor);
    gradient.addColorStop(1, topcolor);
    return gradient;
  };

  getChartData = (canvas) => {
    var grafico = this.state.grafico;
    if (grafico.datasets) {
      const top_colors = [
        "rgba(25, 0, 255, 0.75)",
        "rgba(255, 0, 200, 0.7)",
        "rgba(55, 140, 25, 0.9)"
      ];
      const bottom_colors = [
        "rgba(50, 150, 255, 0.9)",
        "rgba(255, 50, 255, 0.9)",
        "rgba(133, 255, 144, 0.85)"
      ];
      grafico.datasets.forEach((set, i) => {
        set.backgroundColor = this.setGradientColor(
          canvas,
          top_colors[i],
          bottom_colors[i]
        );
        i++;
      });
    }
    return grafico;
  };

  handleScroll = () => {
    let visible;

    window.pageYOffset === 0 ? (visible = true) : (visible = false);

    this.setState({
      visible
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return (
      <div>
        <nav
          className={`navbar ${!this.state.visible ? "navbar--hidden" : ""}`}
        >
          <h1>Trabalho de Inteligência Artificial</h1>
          <h3>Preencha as opções necessárias</h3>
          <Entradas busca={this.busca_solucao}></Entradas>
        </nav>
        <div className="resultado">
          <TableView data={this.state.results}></TableView>
          <div hidden={this.state.grafico.datasets.length === 0 ? true : false}>
            <Line
              options={{ responsive: true }}
              data={this.getChartData}
            ></Line>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
