import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment'
import {
    Button, Dropdown, Label,
  } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
      this.state = {
            isEdit: false,
            gtPr: false,
            visa: this.props.visaStatus,
            expiry: this.props.visaExpiryDate,
            select: '',
        }
        this.handleVisaChange = this.handleVisaChange.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);
      this.edit = this.edit.bind(this);
    }
    
  handleVisaChange(e, { value }){
    console.log(value);
      if(value == 'Work Visa' || value == 'Student Visa'){
          this.setState({
            gtPr: true,
          })
      }
    if (value == 'Permanent Resident' || value == 'Citizen') {
      this.setState({
        gtPr: false,
      })
    }
      this.setState({
        visa: value,
        select: value
      })
    }
    handleChange(date){
      this.setState({
        expiry: date,
      })
    }

  save() {
    this.props.saveProfileData({
      visaStatus: this.state.visa,
      visaExpiryDate: this.state.expiry
    })
    this.edit();
  }
   edit() {        
        this.setState(
          preState => ({ isEdit: !preState.isEdit,                         
          }),
        )
   }

    render() {
        const vopts = [
            { key: 'Citizen', text: 'Citizen', value: 'Citizen' },
            { key: 'Permanent', text: 'Permanent Resident', value: 'Permanent Resident' },
            { key: 'Work', text: 'Work Visa', value: 'Work Visa' },
            { key: 'Student', text: 'Student Visa', value: 'Student Visa' },
          ]
      return(
        <div className='ui sixteen wide column'>

          <p><span>Visa  Type: </span>{this.props.visaStatus}   {this.props.visaExpiryDate ? (<span> Date: {moment(this.props.visaExpiryDate).format('Do MMM, YYYY')} </span>) : ''} </p>
          <Button onClick={this.edit} floated="right" primary>Edit</Button>
          {this.state.isEdit &&
            <React.Fragment>
          <span>Visa Type</span>          
          <Dropdown placeholder="Visa" search selection options={vopts} onChange={this.handleVisaChange} value={this.state.select} />
          {'  '}{this.state.gtPr && <span>Expiry Date: <DatePicker
            selected={this.state.expiry}
            onChange={this.handleChange}
          /> </span>}
            <Button onClick={this.save} floated="right" primary>Save</Button>
          </React.Fragment>
          }
        </div>
      )
    }
}
