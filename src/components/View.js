import React from "react";
import { Card, Container, Button, InputGroup, FormControl } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "react-datepicker/dist/react-datepicker.css";

class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resolutionNotes: [],
      filteredResolutionNotes: [],
      noResolutionNotes: false,
      searchInput: "",
      selectedFilters: [],
    };

    this.fetchResolutionNotes = this.fetchResolutionNotes.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  componentDidMount() {
    this.fetchResolutionNotes();
  }

  fetchResolutionNotes() {
    fetch('http://itinbac-dw0014:7600/resolution_notes')
      .then(response => response.json())
      .then(data => {
        this.setState({
          resolutionNotes: data,
          filteredResolutionNotes: data,
          noResolutionNotes: data.length === 0,
        });
      })
      .catch(error => {
        console.error('Error fetching resolution notes:', error);
      });
  }

  handleSearchInputChange(event) {
    const { value } = event.target;
    this.setState({ searchInput: value });
  }

  handleFilterButtonClick(filterType) {
    const { selectedFilters } = this.state;
    let updatedFilters = [...selectedFilters];

    if (updatedFilters.includes(filterType)) {
      updatedFilters = updatedFilters.filter(item => item !== filterType);
    } else {
      updatedFilters.push(filterType);
    }

    this.setState({ selectedFilters: updatedFilters });
    this.filterResolutionNotes(this.state.searchInput, updatedFilters);
  }

  handleReset() {
    this.setState({
      searchInput: "",
      selectedFilters: [],
    });
    this.filterResolutionNotes("", []);
  }

  filterResolutionNotes(searchInput, selectedFilters) {
    const { resolutionNotes } = this.state;
    let filteredNotes = resolutionNotes.filter(note => {
      return selectedFilters.every(filterType => {
        if (filterType === "Incident") {
          return note.Incident.toLowerCase().includes(searchInput.toLowerCase());
        } else if (filterType === "Jira Ticket") {
          return note[filterType]?.toString().toLowerCase() === "true"; // Use optional chaining here
        } else if (filterType === "SR") {
          return note["Vendor Ticket info"]?.startsWith("SR");
        } else if (filterType === "CR") {
          return note["Vendor Ticket info"]?.startsWith("CR");
        } else {
          return note[filterType] && note[filterType].toString().toLowerCase().includes(searchInput.toLowerCase());
        }
      });
    });
    this.setState({ filteredResolutionNotes: filteredNotes });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.filterResolutionNotes(this.state.searchInput, this.state.selectedFilters);
    }
  }

  handleSearchClick() {
    this.filterResolutionNotes(this.state.searchInput, this.state.selectedFilters);
  }

  render() {
    const { filteredResolutionNotes, noResolutionNotes, selectedFilters } = this.state;

    return (
      <div>
        <div>
          <UserDashboard />
          <Container>
            <br />
            <Card>
              <Card.Body className="card-body-min-height">
                <div className="d-flex justify-content-between mb-3">
                <InputGroup className="search-bar" style={{ width: "300px" }}>
  <FormControl
    type="text"
    placeholder="Search by Incident Number"
    onChange={this.handleSearchInputChange}
    // onKeyPress={this.handleKeyPress}
    value={this.state.searchInput}
  />
  <Button variant="primary" className="search-button" onClick={this.handleSearchClick}>
    <FontAwesomeIcon icon={faSearch} />
  </Button>
</InputGroup>

                  <div>
                    <Button
                      variant={selectedFilters.includes("Vendor Ticket info") ? "primary" : "light"}
                      onClick={() => this.handleFilterButtonClick("Vendor Ticket info")}
                    >
                      Vendor Ticket
                    </Button>
                    <Button
                      variant={selectedFilters.includes("Problem") ? "primary" : "light"}
                      onClick={() => this.handleFilterButtonClick("Problem")}
                    >
                      Problem
                    </Button>
                    <Button
                      variant={selectedFilters.includes("Jira Ticket") ? "primary" : "light"}
                      onClick={() => this.handleFilterButtonClick("Jira Ticket")}
                    >
                      Jira Ticket
                    </Button>
                    <Button
                      variant={selectedFilters.includes("SR") ? "primary" : "light"}
                      onClick={() => this.handleFilterButtonClick("SR")}
                    >
                      SR
                    </Button>
                    <Button
                      variant={selectedFilters.includes("CR") ? "primary" : "light"}
                      onClick={() => this.handleFilterButtonClick("CR")}
                    >
                      CR
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={this.handleReset}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                {noResolutionNotes ? (
                  <p className="text-center fw-bold">No resolution notes available.</p>
                ) : (
                  <table className="table text-center table-bordered">
                    <thead className="table-dark">
                      <tr className="align-center">
                        <th scope="col">Incident</th>
                        <th scope="col">Parent</th>
                        <th scope="col">Vendor Ticket Info</th>
                        <th scope="col">Problem</th>
                        <th scope="col">Jira Ticket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResolutionNotes.map((note, index) => (
                        <tr key={index}>
                          <td>{note.Incident}</td>
                          <td>{note.Parent}</td>
                          <td>{note["Vendor Ticket info"]}</td>
                          <td>{note.Problem}</td>
                          <td>{note["Jira Ticket"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    );
  }
}

export default View;
