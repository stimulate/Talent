import React from 'react';
import Cookies from 'js-cookie';
import { Button, TextArea } from 'semantic-ui-react'

export default class Description extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          characters: 0,
          data: {},
          isEdit: false,
          summary: this.props.summary || '',
          description: this.props.description|| '',
        };
      this.handleDesChange = this.handleDesChange.bind(this)
      this.handleSumChange = this.handleSumChange.bind(this)
      this.save = this.save.bind(this)
      this.edit = this.edit.bind(this)
    };

  handleSumChange(e) {
    this.setState({ summary: e.target.value })
  }

  handleDesChange(e) {
    this.setState({ description: e.target.value })
  }

  edit() {
    this.setState(
      preState => ({ isEdit: !preState.isEdit }),
    )
  }

  save() {
    !this.props.isTalent ? this.props.updateStateData(this.state.data) : this.props.saveProfileData({ summary: this.state.summary, description: this.state.description });
    this.edit()
  }

    render() {
        const characterLimit = 600;
      let characters = this.props.description ? this.props.description.length : 0;
      
        return (
          <React.Fragment>            
            <div className='ui sixteen wide column'>
              Summary:{' '} {this.props.summary} <br />
              Description:{' '} {this.props.description} <br />
              <Button floated="right" onClick={this.edit}>Edit</Button>
              </div>
              {this.state.isEdit &&
                <div className='ui sixteen wide column'>
              <TextArea maxLength={characterLimit / 4} style={{ width: "100%" }} name="summary" placeholder="Please provide a short summary about yourself." onChange={this.handleSumChange}>{this.props.summary}</TextArea>
                  <p>Summary must be between 0-150 characters.</p>
                  <br />
              <TextArea rows="8" maxLength={characterLimit} style={{ width: "100%" }} name="description" placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add." onChange={this.handleDesChange}>{this.props.description}</TextArea>

                  <p>Description must be between 150-600 characters.</p>
                  {!this.props.isTalent && <p>Characters remaining : {characters} / {characterLimit}</p>}
              <Button primary onClick={this.save}>Save</Button>
              <Button basic color="pink" onClick={this.edit}>Cancel</Button>
                </div>}
            </React.Fragment>
        )
    }
}
