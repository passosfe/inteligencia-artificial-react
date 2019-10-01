import React from "react";
import validate from "./LoginFormValidationRules";

class Entradas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantidade: "",
      sub_enc_checkbox: true,
      tem_sim_checkbox: true,
      genetic_checkbox: true,
      temp_tem_sim: "",
      resf_tem_sim: "",
      tam_populacao: "",
      prob_mutacao: "",
      elitismo: "",
      num_geracoes: "",
      error: {},
      error_list: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleError = this.handleError.bind(this);
    this.verificaError = this.verificaError.bind(this);
  }

  verificaError() {
    return Object.keys(this.state.error).length === 0 &&
      this.state.error.constructor === Object
      ? true
      : false;
  }

  handleError(error) {
    let error_aux = Object.keys(error);
    let error_list = error_aux.map((error_item) => (
      <li>{error[error_item]}</li>
    ));
    this.setState({ error_list: error_list });
  }

  handleChange({ target }) {
    if (this.verificaError()) {
      this.setState({
        [target.name]: target.value
      });
    } else {
      this.setState({ [target.name]: target.value }, () => {
        this.setState({
          error: validate(this.state)
        });
      });
    }
  }

  handleToggle({ target }) {
    this.setState({
      [target.name]: !this.state[target.name]
    });
  }

  handleSubmit() {
    this.setState({ error: validate(this.state) }, () => {
      this.verificaError()
        ? this.props.busca(this.state)
        : this.handleError(this.state.error);
    });
  }

  render() {
    return (
      <div className="entradas">
        <div className="ui form">
          <div className="three fields">
            <div className="field">
              <label>Subida de Encosta</label>
              <div className="ui toggle checkbox">
                <input
                  type="checkbox"
                  name="sub_enc_checkbox"
                  defaultChecked={true}
                  value={this.state.sub_enc_checkbox}
                  onClick={this.handleToggle}
                ></input>
                <label>Habilitar/Desabilitar</label>
              </div>
            </div>
            <div className="field">
              <label>Têmpera Simulada</label>
              <div
                className={`field ${
                  this.state.error.temp_tem_sim ? "error" : ""
                }`}
              >
                <input
                  type="number"
                  name="temp_tem_sim"
                  disabled={!this.state.tem_sim_checkbox}
                  placeholder="Temperatura"
                  value={this.state.temp_tem_sim}
                  onChange={this.handleChange}
                ></input>
              </div>
              <div
                className={`field ${
                  this.state.error.resf_tem_sim ? "error" : ""
                }`}
              >
                <input
                  type="number"
                  name="resf_tem_sim"
                  disabled={!this.state.tem_sim_checkbox}
                  placeholder="Resfriamento"
                  value={this.state.resf_tem_sim}
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className="field">
                <div className="ui toggle checkbox">
                  <input
                    type="checkbox"
                    name="tem_sim_checkbox"
                    defaultChecked={true}
                    value={this.state.tem_sim_checkbox}
                    onClick={this.handleToggle}
                  ></input>
                  <label>Habilitar/Desabilitar</label>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Algoritmo Genético</label>
              <div
                className={`field ${
                  this.state.error.tam_populacao ? "error" : ""
                }`}
              >
                <input
                  type="number"
                  name="tam_populacao"
                  disabled={!this.state.genetic_checkbox}
                  placeholder="Tamanho População"
                  value={this.state.tam_populacao}
                  onChange={this.handleChange}
                ></input>
              </div>
              <div
                className={`field ${
                  this.state.error.prob_mutacao ? "error" : ""
                }`}
              >
                <input
                  type="number"
                  name="prob_mutacao"
                  disabled={!this.state.genetic_checkbox}
                  placeholder="Prob. Mutação"
                  value={this.state.prob_mutacao}
                  onChange={this.handleChange}
                ></input>
              </div>
              <div
                className={`field ${this.state.error.elitismo ? "error" : ""}`}
              >
                <input
                  type="number"
                  name="elitismo"
                  disabled={!this.state.genetic_checkbox}
                  placeholder="Elitistmo"
                  value={this.state.elitismo}
                  onChange={this.handleChange}
                ></input>
              </div>
              <div
                className={`field ${
                  this.state.error.num_geracoes ? "error" : ""
                }`}
              >
                <input
                  type="number"
                  name="num_geracoes"
                  disabled={!this.state.genetic_checkbox}
                  placeholder="Numero Gerações"
                  value={this.state.num_geracoes}
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className="ui toggle checkbox">
                <input
                  type="checkbox"
                  name="genetic_checkbox"
                  defaultChecked={true}
                  value={this.state.genetic_checkbox}
                  onClick={this.handleToggle}
                ></input>
                <label>Habilitar/Desabilitar</label>
              </div>
            </div>
          </div>
          <div className="ui input">
            <div
              className={`field ${this.state.error.quantidade ? "error" : ""}`}
            >
              <label>
                Quantidade de Repetições
                <input
                  type="number"
                  name="quantidade"
                  placeholder="Quantidade"
                  value={this.state.quantidade}
                  onChange={this.handleChange}
                ></input>
              </label>
            </div>
          </div>
        </div>
        <button className="ui button" onClick={this.handleSubmit}>
          Calcular
        </button>
        <div className="ui error message" hidden={this.verificaError()}>
          <ul className="list">{this.state.error_list}</ul>
        </div>
      </div>
    );
  }
}

export default Entradas;
