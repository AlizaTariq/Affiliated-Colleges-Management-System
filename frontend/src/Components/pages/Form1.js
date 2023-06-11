import React, { Component } from "react";
import axios from "axios";
class ReactForm1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstDropDown: "",
      secondDropDown: [],
      thirdDropDown: [],
    };
  }

  //Handle first dropdown selection
  handleFirstDropDown = (event) => {
    this.setState({
      firstDropDown: event.target.value,
    });
    const selectedValue = event.target.value;
    //Fetch random numbers from backend
    axios.get("/fetchRandomNumbers/" + selectedValue).then((res) => {
      this.setState({
        secondDropDown: res.data,
      });
    });
  };

  //Handle second dropdown selection
  handleSecondDropDown = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue % 2 === 0) {
      //Fetch random fruits from backend
      axios.get("/fetchRandomFruits/").then((res) => {
        this.setState({
          thirdDropDown: res.data,
        });
      });
    } else {
      //Fetch random vegetables from backend
      axios.get("/fetchRandomVegetables/").then((res) => {
        this.setState({
          thirdDropDown: res.data,
        });
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <form>
          <label>First Dropdown</label>
          <select
            onChange={this.handleFirstDropDown}
            value={this.state.firstDropDown}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="60">60</option>
          </select>
          <br />
          <label>Second Dropdown</label>
          <select onChange={this.handleSecondDropDown}>
            {this.state.secondDropDown.map((num, index) => {
              return (
                <option key={index} value={num}>
                  {num}
                </option>
              );
            })}
          </select>

          <br />
          <label>Third Dropdown</label>
          <select>
            {this.state.thirdDropDown.map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </form>
      </React.Fragment>
    );
  }
}

export default ReactForm1;
