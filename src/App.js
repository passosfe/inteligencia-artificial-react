import React from "react";
import "./App.css";
import { executa_busca } from "./Algoritmos";
import Entradas from "./Entradas";
import { Line } from "react-chartjs-2";
import TableView from "./TableView";
import Loader from "./Loader";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grafico: {
        labels: [],
        datasets: []
      },
      results: [],
      visible: true,
      params_genetico: {},
      loading: false
    };

    this.busca_solucao = this.busca_solucao.bind(this);
    this.startLoading = this.startLoading.bind(this);
  }

  busca_solucao(qtd) {
    let resultado = executa_busca(qtd);
    let params_genetico = {};
    if (resultado.params_genetico !== undefined) {
      params_genetico = resultado.params_genetico;
    }

    this.setState(
      {
        results: resultado.ranking_caminhos,
        params_genetico,
        loading: false
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

    window.pageYOffset <= 0 ? (visible = true) : (visible = false);

    this.setState({
      visible
    });
  };

  startLoading() {
    this.setState({ loading: true });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  resultado() {
    return (
      <div className="resultado">
        <TableView data={this.state.results}></TableView>
        <div
          className="line"
          hidden={this.state.grafico.datasets.length === 0 ? true : false}
        >
          <h2>Comparativo de tentativas</h2>
          <Line options={{ responsive: true }} data={this.getChartData}></Line>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <nav
          className={`navbar ${!this.state.visible ? "navbar--hidden" : ""}`}
        >
          <h1>Trabalho de Inteligência Artificial</h1>
          <h3>Preencha as opções necessárias</h3>
          <Entradas
            busca={this.busca_solucao}
            paramGenetico={this.state.params_genetico}
            loading={this.startLoading}
          ></Entradas>
        </nav>
        <div>{this.state.loading ? <Loader /> : this.resultado()}</div>
        <div className="box">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
          <div className="wave -three"></div>
        </div>
      </div>
    );
  }
}

export default App;
