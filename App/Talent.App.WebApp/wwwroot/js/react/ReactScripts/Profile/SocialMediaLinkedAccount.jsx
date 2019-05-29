/* Social media JSX */
import React from 'react'
import { ChildSingleInput } from '../Form/SingleInput.jsx'
import {
 Popup, Button, Form 
} from 'semantic-ui-react'

export default class SocialMediaLinkedAccount extends React.Component {
  constructor(props) {
    super(props)
    
        this.state = {
          isEdit: false,
          linkedin: '',
          github: '',
    }
        this.edit = this.edit.bind(this)
        this.save = this.save.bind(this)
        this.handleGitChange = this.handleGitChange.bind(this)
        this.handleLnChange = this.handleLnChange.bind(this)
    }

  componentDidMount() {
    $('.ui.button.social-media')
      .popup()    
    }

  edit() {
    this.setState(
      preState => ({ isEdit: !preState.isEdit ,
        linkedin: this.props.linkedAccounts.linkedIn || '',
        github: this.props.linkedAccounts.github || '',
      }),      
    ) 
  }

  handleGitChange(e) {
    this.setState({ github: e.target.value  })
  }

  handleLnChange(e) {
    this.setState({ linkedin: e.target.value })
  }

  async save() {    
        var git = this.state.github
        var ln = this.state.linkedin   
        //console.log("这是临时变量的值：",ln);    
        this.props.saveProfileData({
      linkedAccounts: {
        linkedIn: ln,
        github: git,
      },
    })
    this.edit()
    }

  render() {
     
    if (this.state.isEdit) {
      return(
        <div className='ui sixteen wide column'>
          <Form onSubmit={this.save} >
                <Form.Field>
                  <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                     name="LinkedIn"
                    value={this.state.linkedin}
                    controlFunc={this.handleLnChange}
                    maxLength={50}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter a valid LinkedIn Url"
                  />
                </Form.Field>
                <Form.Field>
                  <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="GitHub"
                    value={this.state.github}
                    controlFunc={this.handleGitChange}
                    maxLength={50}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter a valid Github Url"
                  />
                </Form.Field>
                <Button primary type="submit" >Save</Button>
                <Button onClick={this.edit}>Cancel</Button>
              </Form>
              </div>)
    }
    return (
      <div className='ui sixteen wide column'>
        <Popup content={this.props.linkedAccounts.linkedIn} trigger={<a href={`www.${this.props.linkedAccounts.linkedIn}`}><Button color="linkedin" icon="linkedin" content="LinkedIn" /></a>} />
        <Popup content={this.props.linkedAccounts.github} trigger={<a href={`www.${this.props.linkedAccounts.github}`}><Button color="black" icon="github" content="GitHub" /></a>} />  
              
              <Button color="black" onClick={this.edit} content="Edit" floated="right" />              
            </div>
    ) 
}
}
