import React from "react";
import { Card, Container, DropdownButton, Dropdown, Button } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

class Resolution extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resolutionNotes: [],
      filteredResolutionNotes: [],
      currentPage: 1,
      resolutionNotesPerPage: 1000,
      noResolutionNotes: false,
      selectedArea: "",
      areas: [],
      allAreas: [], 
      startDate: null,
      endDate: null,
    };

    this.fetchResolutionNotes = this.fetchResolutionNotes.bind(this);
    this.handleAreaFilter = this.handleAreaFilter.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  componentDidMount() {
    this.fetchResolutionNotes();
  }

  fetchResolutionNotes() {
    fetch('http://itinbac-dw0477:7600/resolution_notes')
      .then(response => response.json())
      .then(data => {
        const areas = [...new Set(data.map(note => note.Area))];
        this.setState({
          resolutionNotes: data,
          filteredResolutionNotes: data,
          noResolutionNotes: data.length === 0,
          areas: areas,
          allAreas: areas, 
        });
      })
      .catch(error => {
        console.error('Error fetching resolution notes:', error);
      });
  }

  resetData() {
    this.setState({
      selectedArea: "",
      currentPage: 1,
      filteredResolutionNotes: this.state.resolutionNotes,
      startDate: null,
      endDate: null,
    });
  }

  handleAreaFilter(area) {
    const { resolutionNotes } = this.state;
    let filteredNotes = [];
    if (area === "All") {
      filteredNotes = resolutionNotes;
    } else {
      filteredNotes = resolutionNotes.filter(note => note.Area === area);
    }
    this.setState({
      selectedArea: area,
      filteredResolutionNotes: filteredNotes,
      currentPage: 1,
    });
  }

  handleStartDateChange(date) {
    this.setState({
      startDate: date,
    }, this.filterResolutionNotes);
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date,
    }, this.filterResolutionNotes);
  }

  filterResolutionNotes() {
    const { resolutionNotes, startDate, endDate, allAreas } = this.state;
    let filteredNotes = resolutionNotes;

    if (startDate && endDate) {
      filteredNotes = resolutionNotes.filter(note => {
        const noteDate = new Date(note.Opened);
        return noteDate >= startDate && noteDate <= endDate;
      });

      const areas = [...new Set(filteredNotes.map(note => note.Area))];
      this.setState({
        filteredResolutionNotes: filteredNotes,
        currentPage: 1,
        areas: areas,
      });
    } else {
      this.setState({
        filteredResolutionNotes: resolutionNotes,
        currentPage: 1,
        areas: allAreas, 
      });
    }
  }

  render() {
    const { filteredResolutionNotes, currentPage, resolutionNotesPerPage, noResolutionNotes, selectedArea, areas } = this.state;
    const lastIndex = currentPage * resolutionNotesPerPage;
    const firstIndex = lastIndex - resolutionNotesPerPage;
    const currentResolutionNotes = filteredResolutionNotes.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredResolutionNotes.length / resolutionNotesPerPage);

    return (
      <div>
        <div>
          <UserDashboard />
          <Container >
            <br />
            <Card >
              <Card.Body className="card-body-min-height" >
                {noResolutionNotes ? (
                  <p className="text-center fw-bold">No resolution notes available.</p>
                ) : (
                  <>
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <DropdownButton
                          title={selectedArea !== "" ? `Filter: ${selectedArea}` : "Filter by Area"}
                          variant="primary"
                          onSelect={this.handleAreaFilter}
                        >
                          <Dropdown.Item eventKey="All">All</Dropdown.Item>
                          {areas.map((area, index) => (
                            <Dropdown.Item key={index} eventKey={area}>{area}</Dropdown.Item>
                          ))}
                        </DropdownButton>
                      </div>
                      <div className="col-sm-3 form-group">
                        <DatePicker
                          className="form-control"
                          dateFormat="dd-MM-yyyy"
                          selected={this.state.startDate}
                          placeholderText="Select From Date"
                          showPopperArrow={false}
                          onChange={this.handleStartDateChange}
                          maxDate={this.state.endDate ? this.state.endDate : null}
                        />
                      </div>
                      <div className="col-sm-3 form-group">
                        <DatePicker
                          className="form-control"
                          dateFormat="dd-MM-yyyy"
                          selected={this.state.endDate}
                          placeholderText="Select To Date"
                          showPopperArrow={false}
                          onChange={this.handleEndDateChange}
                          minDate={this.state.startDate ? this.state.startDate : null}
                        />
                      </div>
                      <div>
                        <Button onClick={this.resetData}>Reset</Button>
                      </div>
                    </div>
                    <table className="table text-center table-bordered ">
                      <thead className="table-dark">
                        <tr className="align-center">
                          <th scope="col">Incident</th>
                          <th scope="col">Opened</th>
                          <th scope="col">Short Description</th>
                          <th scope="col">Country</th>
                          <th scope="col">Priority</th>
                          <th scope="col">Area</th>
                          <th scope="col">Category</th>
                          <th scope="col">Sub Category</th>
                          <th scope="col">RCA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentResolutionNotes.map((note, index) => (
                          <tr key={index}>
                            <td>{note.Incident}</td>
                            <td>{note.Opened}</td>
                            <td>{note["Short description"]}</td>
                            <td>{note.Country}</td>
                            <td>{note.Priority}</td>
                            <td>{note.Area}</td>
                            <td>{note.Category}</td>
                            <td>{note.Subcategory}</td>
                            <td>{note.RCA}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    );
  }
}

export default Resolution;
