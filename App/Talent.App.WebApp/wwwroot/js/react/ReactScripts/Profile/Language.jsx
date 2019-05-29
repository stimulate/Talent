/* Language section */
import React from 'react'
import Cookies from 'js-cookie'
import {
  Table, Button, Icon, Dropdown, Form
} from 'semantic-ui-react'
import { ChildSingleInput } from '../Form/SingleInput.jsx'

export default class Language extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      isEdit: false,
      isAdd: false,
      language: [],
      lan2edit: { id: '', name: '', level: '' },
      data: {id:'', name: '', level: ''},
    }
    this.edit = this.edit.bind(this)
    this.add = this.add.bind(this)
    this.del = this.del.bind(this)
    this.save = this.save.bind(this)
    this.update = this.update.bind(this)
    this.handleLevelChange = this.handleLevelChange.bind(this)
    this.handleLanChange = this.handleLanChange.bind(this)
    this.forEdit = this.forEdit.bind(this)
  }

  forEdit() {
    this.setState(
      preState => ({ isEdit: !preState.isEdit }),
    )
  }

  edit(lan) {
    this.forEdit();
    this.setState({
      lan2edit: lan
    })
  }

  add() {
    this.setState(
      preState => ({ isAdd: !preState.isAdd }),
    )
  }

  del(lan) {
    var newLan = this.props.languageData.filter(l => l != lan);
    this.setState({ language: newLan });
    this.props.updateProfileData({ languages: newLan })
  }

  update() {
    var newData = this.props.languageData.map(item => {
      if (item.id === this.state.lan2edit.id) {
        item = { ...item, ...this.state.lan2edit };
      }
      return item;
    })    
    console.log("data", newData)
    this.setState({ language: newData });
    this.props.updateProfileData({ languages: newData })
    this.forEdit();
  }

  save(e){
    e.preventDefault();
    var newData = [...this.props.languageData, { ...this.state.data }]
    console.log("data", newData)
    this.setState({ language: newData });
    this.props.updateProfileData({ languages: newData })
    this.add();
  }

  handleLevelChange(e, { value }) {
    this.state.isEdit ?
    this.setState(preState => ({
      lan2edit: { ...preState.lan2edit, level: value },
    })) :
    this.setState(preState =>({
      data:{...preState.data, level : value},
    }))
  }
  handleLanChange(e) {
    const x = e.target.value;
    this.state.isEdit ?
      this.setState(preState => ({
        lan2edit: { ...preState.lan2edit, name: x},
      })) :
    this.setState(preState => ({
      data: { ...preState.data, name: x }
    }))
  }

  render() {
    const lopts = [
      { key: 'Basic', text: 'Basic', value: 'Basic' },
      { key: 'Conversational', text: 'Conversational', value: 'Conversational' },
      { key: 'Fluent', text: 'Fluent', value: 'Fluent' },
      { key: 'Native', text: 'Native/Bilingual', value: 'Native' },
    ]

    const ls = this.props.languageData.map(
      (l) => (<React.Fragment>            
            <Table.Row key={l.id}>
            <Table.Cell>{l.name}</Table.Cell>
            <Table.Cell>{l.level}</Table.Cell>
            <Table.Cell textAlign="right">
              <Icon name="edit" link="true" onClick={e => this.edit(l, e)} />
              <Icon name="delete" link="true" onClick={e => this.del(l, e)} />
            </Table.Cell>
            </Table.Row> 
            </React.Fragment>
      )
    ) || ''
    
    if (this.state.isAdd) {
      return (
        <div className='ui sixteen wide column'>
        <Form onSubmit={this.save}>
                <Form.Field>
              Language:   <input type="text" placeholder="Language" onChange={this.handleLanChange}  />          
          </Form.Field>
          <Form.Field>
          Level: <Dropdown placeholder="Language Level" selection options={lopts} onChange={this.handleLevelChange} value={this.state.data.level} />
          </Form.Field>
          <Button primary type="submit">Add</Button>
          <Button onClick={this.add}>Cancel</Button>
        </Form>
        </div>
      )
    }
    return (
      <div className='ui sixteen wide column'>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Language</Table.HeaderCell>
            <Table.HeaderCell>Level</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">
              <Button color="black" attached="right" icon="add" onClick={this.add} content="Add New" />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

          <Table.Body>
            {this.state.isEdit ? (
              <Table.Row>
                <Table.Cell><input type="text" onChange={this.handleLanChange} value={this.state.lan2edit.name} /> </Table.Cell>
                <Table.Cell><Dropdown selection options={lopts} onChange={this.handleLevelChange} value={this.state.lan2edit.level} /></Table.Cell>
                <Table.Cell textAlign="right">
                  <Button basic color="blue" onClick={this.update}>Update</Button>
                  <Button basic color="pink" onClick={this.forEdit}>Cancel</Button>
                </Table.Cell>
              </Table.Row>) :
              ls}
        </Table.Body>
      </Table>
      </div>
    )
  }
}
