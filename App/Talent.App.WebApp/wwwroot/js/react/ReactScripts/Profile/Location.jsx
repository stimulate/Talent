import React from 'react'
import Cookies from 'js-cookie'
import { Form, Button, Dropdown } from 'semantic-ui-react'
import { default as Countries } from '../../../../util/jsonFiles/countries.json'
import { ChildSingleInput } from '../Form/SingleInput.jsx'

export class Address extends React.Component {
  constructor(props) {
    super(props)    

    this.state = {
      address: {},
      isEdit: false,
      cntSelect: '',
      ctSelect: '',
    }    
    this.edit = this.edit.bind(this)
    this.save = this.save.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleCityChange = this.handleCityChange.bind(this)
  }

  handleChange(event) {    
    const tar = event.target;
    const data = Object.assign({}, this.state.address)    
    data[tar.name] = tar.value
    this.setState(
      preState => ({
        address: { ...preState.address, ...data}
      })      
    )
  }

  edit() { 
    this.setState(
      preState => ({
        isEdit: !preState.isEdit,
        address: this.props.addressData
      }),
    )    
  }

  save(e) {
    e.preventDefault();
    this.props.saveProfileData({
      address: this.state.address,
    })
    this.edit()
  }

  handleCountryChange(e, { value }) {     
    this.setState(preState => ({
      address: { ...preState.address, country: value },
      cntSelect: value
    }))
  }

  handleCityChange(e, { value }) {    
    this.setState(preState => ({
      address: { ...preState.address, city: value },
      ctSelect: value
    }))
  }

  render() {
    const {
      addressData = {
        number: '',
        street: '',
        suburb: '',
        postCode: '',
        city: '',
        country: ''
      },
    } = this.props

    const cnt = Object.keys(Countries).map(
      d => ({key: d, text: d, value: d})
    )
    const ct = addressData.country? Countries[addressData.country].map(
      d => ({key: d, text: d, value: d})
    ) : [];
        if(this.state.isEdit){
          return(
            <div className='ui sixteen wide column'> 
              <Form onSubmit={this.save}>
            <Form.Group widths='equal'>
                  <Form.Field>
            Number:
            <input
            type="text"
            label="Number"
            name="number"
            defaultValue={this.state.address.number}
            onChange={this.handleChange}
            maxLength={10}
            placeholder="Enter your Street Number"
            errorMessage="Please enter a valid Street Number"
                  />  </Form.Field>
                  <Form.Field>
              Street:
             <input
              type="text"
              label="Street"
              name="street"
              defaultValue={this.state.address.street}
              onChange={this.handleChange}
              maxLength={30}
              placeholder="Enter your Street Name"
              errorMessage="Please enter a valid Street Name"
                  />  </Form.Field>
                  <Form.Field>
               Suburb:
              <input
              type="text"
              label="suburb"
              name="Suburb"
              defaultValue={this.state.address.suburb}
              onChange={this.handleChange}
              maxLength={20}
              placeholder="Enter your Suburb Name"
              errorMessage="Please enter a valid Suburb Name"
            />
                </Form.Field>
              </Form.Group>
             <Form.Group widths='equal'>
                <Form.Field>           
                    Country: <Dropdown placeholder="Country" search selection options={cnt} onChange={this.handleCountryChange} value={addressData.country} />
                </Form.Field>
              <Form.Field>   
                City: <Dropdown placeholder="City" search selection options={ct} onChange={this.handleCityChange} value={addressData.city} />
              </Form.Field>
                  <Form.Field>
              Post Code:
              <input
              type="text"
              label="Post Code"
              name="postCode"
              defaultValue={this.state.address.postCode}
              onChange={this.handleChange}
              maxLength={10}
              placeholder="Enter your Post Code"
              errorMessage="Please enter a valid Post Code"
            />
                </Form.Field>
                </Form.Group>
            <Button primary type="submit">Save</Button>
            <Button onClick={this.edit} >Cancel</Button>
            </Form>
            </div>
          )
        }
    return (
      <div className='ui sixteen wide column'>        
        <p>Address:  {this.props.addressData.number} {this.props.addressData.street} {this.props.addressData.suburb}</p>   
        <p>City:  {this.props.addressData.city}</p>
        <p>Country:  {this.props.addressData.country}</p>
        <Button color="black" onClick={this.edit} content="Edit" floated="right" />              
      </div> 
    )
  }
}

export class Nationality extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nationality: this.props.nationalityData,
      select:''
    }
    this.handleNationChange = this.handleNationChange.bind(this)
  }

  handleNationChange(e, { value }) {
    this.setState(preState => ({
      nationality: { ...preState.nationality, nationality: value },
      select: value
      }))
    this.props.saveProfileData({
      nationality: value,
    })
  }

  render() {
    const cnt = Object.keys(Countries).map(
      d => ({key: d, text: d, value: d})
    )
    return (
      <Dropdown placeholder="Please select your Nationality" search selection options={cnt} onChange={this.handleNationChange} value={this.props.nationalityData} />
    )
  }
}
