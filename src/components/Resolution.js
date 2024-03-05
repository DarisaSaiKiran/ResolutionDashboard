import React from "react";
import { Card, Container, DropdownButton, Dropdown } from "react-bootstrap";
// import UserDashboard from "./UserDashboard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Resolution extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resolutionNotes: [],
      filteredResolutionNotes: [],
      currentPage: 1,
      resolutionNotesPerPage: 10,
      noResolutionNotes: false,
      selectedArea: "",
      areas: [], 
    };

    this.fetchResolutionNotes = this.fetchResolutionNotes.bind(this);
    this.handleAreaFilter = this.handleAreaFilter.bind(this);
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
        });
      })
      .catch(error => {
        console.error('Error fetching resolution notes:', error);
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

  render() {
    const { filteredResolutionNotes, currentPage, resolutionNotesPerPage, noResolutionNotes, selectedArea, areas } = this.state;
    const lastIndex = currentPage * resolutionNotesPerPage;
    const firstIndex = lastIndex - resolutionNotesPerPage;
    const currentResolutionNotes = filteredResolutionNotes.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredResolutionNotes.length / resolutionNotesPerPage);

    return (
      <div>
        <div>
          {/* <UserDashboard /> */}
          <Container >
            <br />
            <Card >
              <Card.Header className="fw-bold p-2 mb-2 bg-primary text-center text-white">
                RESOLUTION NOTES
              </Card.Header>
              <Card.Body className="card-body-min-height" >
                {noResolutionNotes ? (
                  <p className="text-center fw-bold">No resolution notes available.</p>
                ) : (
                  <>
                    <div className="d-flex justify-content-end mb-3">
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
                    <table className="table text-center table-white table-bordered ">
                      <thead className="table-dark">
                        <tr className="align-center">
                          <th scope="col">Incident</th>
                          <th scope="col">Opened</th>
                          <th scope="col">Short Description</th>
                          <th scope="col">Resolution Notes</th>
                          <th scope="col">Area</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentResolutionNotes.map((note, index) => (
                          <tr key={index}>
                            <td>{note.Incident}</td>
                            <td>{note.Opened}</td>
                            <td>{note["Short description"]}</td>
                            <td>{note["Resolution Notes"]}</td>
                            <td>{note.Area}</td>
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
