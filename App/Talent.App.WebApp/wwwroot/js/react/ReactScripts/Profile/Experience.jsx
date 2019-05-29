/* Experience section */
import React from 'react'
import Cookies from 'js-cookie'
import uuidv1 from 'uuid/v1'
import {
  Table, Button, Icon, Dropdown, Form
} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { ChildSingleInput } from '../Form/SingleInput.jsx'

export default class Experience extends React.Component {
  constructor(props) {
    super(props)
    const edata = {
      company: '',
      position: '',
      start: '',
      end: '',
      responsibilities: '' 
    }
    this.state = {
      isEdit: false,
      isAdd: false,
      start: '',
      end: '',
      data: edata,
      initialData: edata,
      exp: this.props.experienceData,
    }
    this.edit = this.edit.bind(this)
    this.add = this.add.bind(this)
    this.save = this.save.bind(this)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.update = this.update.bind(this)
   // this.Expform = this.Expform.bind(this)
  }

  save(e) {
    e.preventDefault();
    var newData = [...this.props.experienceData, { ...this.state.data }]
    console.log("data", newData)
    this.setState({ exp: newData });
    this.props.updateProfileData({ experience: newData })
    this.add();
  }

  edit(exp) {
    this.setState(
      preState => ({
        isEdit: !preState.isEdit,
        data: exp
      }),
    )
  }

  add() {
    this.setState(
      preState => ({ isAdd: !preState.isAdd }),
    )
  }

  del(exp) {
    var newExp = this.props.experienceData.filter(l => l != exp);
    this.setState({ exp: newExp });
    this.props.updateProfileData({ experience: newExp })
  }

  update(exp) {
    var newData = this.props.experienceData.map(item => {
      if (item.id === exp.id) {
        item = { ...item, ...exp };
      }
      return item;
    })
    console.log("data", newData)
    this.setState({ exp: newData });
    this.props.updateProfileData({ experience: newData })
    this.edit();
  }

  handleChange(e) {    
    const { target } = e
    const { name, value } = target
    
    this.setState(
      pre => ({
        data: { ...pre.data, [name]: value }
      })
    )
}

  handleStartChange(date){
    var d = this.state.data
    this.setState({
      start: date,
      data: {...d, start: date}
    })
  }

  handleEndChange(date){
    var d = this.state.data
    this.setState({
      end: date,
      data : {...d, end: date}
    })
  }

 expform = ( exp ) => {
    return (
      <React.Fragment>
        <Table.Cell>
          <input            
            type="text"
            name="company"
            label="Company"
            defaultValue={exp.company}
            onChange={e => this.handleChange(e)}
            maxLength={20}
            placeholder="Company"
            errorMessage="Please enter a valid Company name"
          />
        </Table.Cell>
        <Table.Cell>
          <input           
            type="text"
            name="position"
            label="Position"
            defaultValue={exp.position}
            onChange={e => this.handleChange(e)}
            maxLength={20}
            placeholder="Position"
            errorMessage="Please enter a valid Position name"
          /> </Table.Cell>

        <Table.Cell>
          <input            
            type="text"
            label="responsibilities"
            onChange={e => this.handleChange(e)}
            defaultValue={exp.responsibilities}
            maxLength={20}
            placeholder="Responsibilities"
            name="responsibilities"
            errorMessage="Please enter a valid Responsibilities name"
          /> </Table.Cell>

        <Table.Cell>
          <DatePicker
            name='start'
            title='Start Date'
            selected={exp.start || this.state.start}
            onChange={e => this.handleStartChange(e)}
          />
        </Table.Cell>

        <Table.Cell>
          <DatePicker
            name='end'
            title="End Date"
            selected={exp.end || this.state.end}
            onChange={e => this.handleEndChange(e)}
          /> </Table.Cell>

      </React.Fragment>
    )
 };
  
  render() {
    const ls = this.props.experienceData.map(
      l => (
        <Table.Row key={l.id}>
          <Table.Cell>{l.company}</Table.Cell>
          <Table.Cell>{l.position}</Table.Cell>
          <Table.Cell>{l.responsibilities}</Table.Cell>
          <Table.Cell>{moment(l.start).format('Do MMM, YYYY')}</Table.Cell>
          <Table.Cell>{moment(l.end).format('Do MMM, YYYY')}</Table.Cell>
          <Table.Cell>
            <Icon name="edit" link="true" onClick={e => this.edit(l, e)} />
            <Icon name="delete" link="true" onClick={e => this.del(l, e)} />
          </Table.Cell>
        </Table.Row>
      ),
    ) || ''    
    
    return (
      <div className='ui sixteen wide column'>  
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Position</Table.HeaderCell>
            <Table.HeaderCell>Responsibilities</Table.HeaderCell>
            <Table.HeaderCell>Start</Table.HeaderCell>
            <Table.HeaderCell>End</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">
              <Button color="black" floated="right" icon="add" onClick={this.add}>Add New</Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

          <Table.Body>
            {this.state.isEdit &&
              (
                <Table.Row key={uuidv1}>
                {this.expform(this.state.data)}
                  <Button basic color="blue" type="submit" onClick={e => this.update(this.state.data, e)}>Update</Button>
                  <Button basic color="pink" onClick={this.edit}>Cancel</Button>
                </Table.Row>
              )}
            {this.state.isAdd && 
       (
        <Table.Row key={uuidv1}>
                {this.expform(this.state.initialData)}
              <Button primary type="submit" onClick={e => { e.persist(); this.save(e) }} >Add</Button>
              <Button onClick={this.add}>Cancel</Button>
            </Table.Row>)
        }
            {!this.state.isAdd && !this.state.isEdit && ls}
        </Table.Body>
        </Table>
        </div>
    )
  }
}
