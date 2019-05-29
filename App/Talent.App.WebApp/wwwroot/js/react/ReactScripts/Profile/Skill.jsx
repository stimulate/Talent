/* Skill section */
import React from 'react'
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx'
import { Table, Button, Icon, Dropdown, Form} from 'semantic-ui-react'

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
            isEdit: false,
            isAdd: false,
            skill: this.props.skillData || [],
            data: { id: '', name: '', level: '' },
        }
        this.edit = this.edit.bind(this)
        this.add = this.add.bind(this)
        this.del = this.del.bind(this)
        this.save = this.save.bind(this)
        this.handleLevelChange = this.handleLevelChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
   
  edit(sk) {        
        this.setState(
          preState => ({ isEdit: !preState.isEdit,
                         data: sk
          }),
        )
      }
    
    add() {
        this.setState(
          preState => ({ isAdd: !preState.isAdd }),
        )
      }

    del(sk) {
      var newSk = this.props.skillData.filter(l => l != sk);
      this.setState({ language: newSk });
      this.props.updateProfileData({ skills: newSk })
    }

    update(sk) {
      var newData = this.props.skillData.map(item => {
        if (item.id === sk.id) {
          item = { ...item, ...sk};
        }
        return item;
      })
      console.log("data", newData)
      this.setState({ skill: newData });
      this.props.updateProfileData({ skills: newData })
      this.edit();
    }

    save(e) {
      e.preventDefault();
      var newData = [...this.props.skillData, { ...this.state.data }]
      console.log("data", newData)
      this.setState({ skill: newData });
      this.props.updateProfileData({ skills: newData })
      this.add();
    }

    handleLevelChange(e, { value }) {
      this.setState(preState => ({
        data: { ...preState.data, level: value }
      }))
    }

    handleChange(e) {
      e.persist();
        const x = e.target.value;
        this.setState(preState => ({
          data: { ...preState.data, name: x }
        }))
    }

  render() {

    const lopts = [
      { key: 'Beginner', text: "Beginner", value: 'Beginner' },
      { key: 'Intermediate', text: "Intermediate", value: 'Intermediate' },
      { key: 'Expert', text: "Expert", value: 'Expert' },
    ];

        const ls = this.props.skillData.map(
          l => (                         
                 <Table.Row key={l.id}>
                    <Table.Cell>{l.name}</Table.Cell>
                    <Table.Cell>{l.level}</Table.Cell>
                    <Table.Cell textAlign="right">
                      <Icon name="edit" link="true" onClick={e => this.edit(l, e)} />
                      <Icon name="delete" link="true" onClick={e => this.del(l, e)} />
                    </Table.Cell>
                  </Table.Row>  
            )
        ) || '';
    
        if (this.state.isAdd) {
          return (
            <div className='ui sixteen wide column'>
              <Form onSubmit={this.save}>
            <Form.Field>
              <ChildSingleInput
                inputType="text"
                name="skill"
                controlFunc={this.handleChange}
                maxLength={20}
                placeholder="Add Skill"
                errorMessage="Please enter a valid skill name"
              />
              </Form.Field>  
              <Form.Field>  
                  <Dropdown placeholder='Skill Level' search selection options={lopts} value={this.state.data.level} onChange={this.handleLevelChange} />
              </Form.Field>  
              <Button primary type='submit'>Add</Button>
              <Button onClick={this.add}>Cancel</Button>
              </Form>
            </div>)
        }
        return (
            <div className='ui sixteen wide column'>
            <Table celled>
    <Table.Header>
        <Table.Row>
            <Table.HeaderCell>Skill</Table.HeaderCell>
            <Table.HeaderCell>Level</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>
                <Button color='black' attached='right' icon='add' onClick={this.add}>Add New</Button>
            </Table.HeaderCell>
        </Table.Row>
    </Table.Header>

              <Table.Body>
                {this.state.isEdit ?
                  (
                    <Table.Row>
                  <Table.Cell><input type="text" onChange={this.handleChange} defaultValue={this.state.data.name} /> </Table.Cell>
                  <Table.Cell><Dropdown selection options={lopts} onChange={this.handleLevelChange} value={this.state.data.level} /></Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button basic color="blue" onClick={e => this.update(this.state.data, e)}>Update</Button>
                    <Button basic color="pink" onClick={this.edit}>Cancel</Button>
                  </Table.Cell>
                </Table.Row>
                  ) :
        ls}
    </Table.Body>
</Table>
</div>
            )
        
    }
}

