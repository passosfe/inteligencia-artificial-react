import React from "react";
import { Object } from "core-js";

class TableView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_place: {},
      second_place: {},
      third_place: {}
    };

    this.head = this.head.bind(this);
    this.verifyEmpty = this.verifyEmpty.bind(this);
  }

  verifyEmpty(target) {
    return;
  }

  componentWillReceiveProps() {
    console.log(this.props);
    const places = Object.keys(this.state);
    for (let i = 0; i < places.length; i++) {
      if (this.props.data[i]) {
        let table_results = this.props.data[i].table.map((item) => (
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
        let place_result = {
          place_type: this.props.data[i].type,
          place_cost: this.props.data[i].cost,
          table: table_results
        };
        this.setState({ [places[i]]: place_result });
      } else {
        this.setState({ [places[i]]: {} });
      }
    }
  }

  head() {
    return (
      <tr>
        <th>Nome</th>
        <th>Origem</th>
        <th>Hora Ida (Saida)</th>
        <th>Hora Ida (Chegada)</th>
        <th>Preco Ida</th>
        <th>Hora Volta (Saida)</th>
        <th>Hora Volta (Chegada)</th>
        <th>Preco Volta</th>
      </tr>
    );
  }

  render() {
    return (
      <div className="ranking">
        <div
          hidden={
            Object.keys(this.state.first_place).length === 0 &&
            this.state.first_place.constructor === Object
              ? true
              : false
          }
        >
          <h2>1 Lugar</h2>
          <div>{this.state.first_place.place_type}</div>
          <div>{this.state.first_place.place_cost}</div>
          <table className="ui celled table">
            <thead>{this.head()}</thead>
            <tbody name="first_place">{this.state.first_place.table}</tbody>
          </table>
        </div>
        <div
          hidden={
            Object.keys(this.state.second_place).length === 0 &&
            this.state.second_place.constructor === Object
              ? true
              : false
          }
        >
          <h2>2 Lugar</h2>
          <div>{this.state.second_place.place_type}</div>
          <div>{this.state.second_place.place_cost}</div>
          <table className="ui celled table">
            <thead>{this.head()}</thead>
            <tbody name="">{this.state.second_place.table}</tbody>
          </table>
        </div>
        <div
          hidden={
            Object.keys(this.state.third_place).length === 0 &&
            this.state.third_place.constructor === Object
              ? true
              : false
          }
        >
          <h2>3 Lugar</h2>
          <div>{this.state.third_place.place_type}</div>
          <div>{this.state.third_place.place_cost}</div>
          <table className="ui celled table">
            <thead>{this.head()}</thead>
            <tbody>{this.state.third_place.table}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TableView;
