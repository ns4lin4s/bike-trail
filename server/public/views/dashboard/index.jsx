import React from 'react';
import Menu from '../components/menu'
import Footer from '../components/footer'
import StationTable from './table'
import Filter from './filter'
import LineChartStation from './lineChartStation'
import BarChartStation from './barChartStation'
import PieChartStation from './pieChartStation'
import Map from './mapComponent'
import Select from 'react-select';
import moment from 'moment';


export default class Dashboard extends React.Component {

    constructor(props)
    {
        super(props)
        console.log("Index.jsx")
        console.log(props)

        moment.locale('es')

        this.state = {
            selectedOption: null,
            optionsFilter: [],
            stations: [],
            totalUsadas: 0,
            totalLibres: 0,
            geoJSON : {
              type : "FeatureCollection",
              crs: {
                type : "name",
                properties: {
                  name : "urn:ogc:def:crs:OGC:1.3:CRS84"
                }
              },
              features: [],
            },
            
            data: []
         }
        
        props.stations_history.forEach(element => {
          this.state.optionsFilter.push({label: element.name, value: element.id })
          this.state.totalLibres += element.totalLibres
          this.state.totalUsadas += element.totalUsadas

          this.state.geoJSON.features.push(
            { 
              type : "Feature",
              properties: {
                id : element.id,
                mag : element.disponibles,
                time : new Date(),
                felt : null,
                tsunami : 0,
              },
              geometry:{ 
                type : "Point",
                coordinates: new Array( parseFloat(element.longitude),parseFloat(element.latitude))
              }
            }
          )

        });

        this.state.stations = props.stations_history 

        this.buildChart = this.buildChart.bind(this)

        this.handleChange = this.handleChange.bind(this)

        //BarChar & LineChart
        let data = []
        
        for(let i = 1; i <= 60; i++ )
        {
          data.push({ name: i.toString(), disponibles: 0, ocupadas: 0 })
        }

        this.state.data = data        
    }

    mapStation(stations, history){
      
      let arr = stations.map((obj, id) => {
          
        let log= history.filter((e)=>{
          
            return e.name == obj.name
        })
        
        let totalLibres = 0
        let totalUsadas = 0 

        log.forEach(element => {
          totalLibres += element.available_bikes
          totalUsadas += element.busy_bikes
        });

        return { expand: log, id: obj.id, name: obj.name, totalLibres, totalUsadas }

      })
      
      return arr
    }    

    handleChange(selectedOption)
    {
      const self = this
      
      fetch('http://localhost:3000/station/' + selectedOption.value, {
          method: 'GET'
      })
      .then(response => response.json())
      .then(output => {
          
          this.setState({ selectedOption });
          
          let totalLibres = 0
          let totalUsadas = 0

          output.stations_history.forEach(element => {
            totalLibres += element.totalLibres
            totalUsadas += element.totalUsadas
          });

          //BarChar & LineChart
          let data = []
            
          for(let i = 1; i <= 60; i++ )
          {
            data.push({ name: i.toString(), disponibles: 0, ocupadas: 0 })
          }

          this.setState({stations:output.stations_history, totalLibres, totalUsadas,data},()=>{
            output.graphs.forEach((e)=>{
              self.buildChart(e)
            })
          })
      })     
    }

    render() {

      return (
      <React.Fragment>

        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
              </button>

              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow d-sm-none">
                  <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fas fa-search fa-fw"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                    <form className="form-inline mr-auto w-100 navbar-search">
                      <div className="input-group">
                        <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </li>
                <div className="topbar-divider d-none d-sm-block"></div>
                <li className="nav-item dropdown no-arrow">
                  <a target="_blank" className="nav-link dropdown-toggle" href="https://www.linkedin.com/in/nelson-osvaldo-salinas/" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">Nelson Salinas</span>
                    <img className="img-profile rounded-circle" src="https://media.licdn.com/dms/image/C4E03AQHdzqhc2W7bpw/profile-displayphoto-shrink_200_200/0?e=1560384000&v=beta&t=JbLwuGeVX60UWJ3Fbe54OsqhagIWV5mV1RoOy71ljjQ" />
                  </a>
                </li>
              </ul>
            </nav>
            <div className="container-fluid">
            
              <div className="row" style={{"height":800}}>
                
                <div className="col-xl-8 col-lg-8">
                  
                  <Map data={this.state.geoJSON}></Map>
                  

                </div>
                
                <div className="col-xl-4 col-lg-4">
                  <div className="card shadow mb-4">
                    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 class="m-0 font-weight-bold text-primary">Filtrar por estaciones:</h6>
                    </div>
                    <div className="card-body">

                        
                            <Select
                              placeholder="Filtrar por estación"
                              value={ this.state.selectedOption}
                              onChange={this.handleChange}
                              options={this.state.optionsFilter}
                              />
                          
                    </div>
                  </div>

                  {/* <Filter></Filter> */}

                  <StationTable 
                      stations={this.state.stations} 
                      totalLibres={this.state.totalLibres} 
                      totalUsadas={this.state.totalUsadas}>
                    </StationTable>
                    
                

                </div>
              </div>
                
              <div className="row">
                
                <div className="col-xl-8 col-lg-8">

                  <LineChartStation data={this.state.data}></LineChartStation>

                  <BarChartStation data={this.state.data} ></BarChartStation>

                  <PieChartStation totalLibres={this.state.totalLibres} totalUsadas={this.state.totalUsadas}></PieChartStation>

                </div>
                <div className="col-xl-4 col-lg-4"></div>

              </div>

            </div>
          </div>
          <Footer></Footer>
        </div>
        
      </React.Fragment>
      )
    }

    buildChart(element)
    {
      //verifica si contiene la frase: hace x minutos
      let match = moment(element.date).fromNow().match(/hace (\d+|un) (minutos|minuto)/g)
  
      //en el caso de que realice el match entra a este if
      if(match != null && match.length > 0)
      {
          let minutes_ago = 0
          //extrae el numero y lo resta con 60min
          if(match[0].match(/\d+/g) != null)
              minutes_ago = (60 - parseInt(match[0].match(/\d+/g)[0], 10))
          else
              minutes_ago = (60 - 1)
          
          this.setState(state => {
            
            const data = state.data.map((item, j) => {
              
              if (parseInt(item.name, 10) == minutes_ago) 
              {
                
                item.disponibles += element.available_bikes
                item.ocupadas += element.busy_bikes
                
                return item
              } 
              else 
              {
                return item;
              }
            });
      
            return {
              data
            };
          });
      }
    }

    componentDidMount()
    {
      this.props.graphs.forEach(element => {

        this.buildChart(element)

      })
    }
}
