import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react'
import { SingleInput } from '../Form/SingleInput.jsx'

export default class TalentStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: this.props.status.status,
    }
    this.handleChange = this.handleChange.bind(this)
    }

  handleChange = (e, { value }) => {
    this.setState({ value })
    this.setState({ status: value })
    this.props.saveProfileData({
      jobSeekingStatus: {
        status: value,
        availableDate: null,
      }
    })
  }

    render() {
      return (
          <Form>
              <Form.Field>
          Current Status: 
                {' '}
    <b>{this.state.status}</b>
        </Form.Field>
              <Form.Field>
          <Checkbox
            radio
            label="Actively looking for a job"
            name="checkboxRadioGroup"
              value="Actively looking for a job"
              checked={this.props.status.status === 'Actively looking for a job'}
            onChange={this.handleChange}
          />
        </Form.Field>
              <Form.Field>
          <Checkbox
            radio
            label="Not looking for a job at the moment"
            name="checkboxRadioGroup"
              value="Not looking for a job at the moment"
              checked={this.props.status.status === 'Not looking for a job at the moment'}
            onChange={this.handleChange}
          />
        </Form.Field>
              <Form.Field>
          <Checkbox
            radio
            label="Currently employed but open to offers"
            name="checkboxRadioGroup"
              value="Currently employed but open to offers"
              checked={this.props.status.status === 'Currently employed but open to offers'}
            onChange={this.handleChange}
          />
        </Form.Field>
              <Form.Field>
          <Checkbox
            radio
            label="Will be available on later date"
            name="checkboxRadioGroup"
              value="Will be available on later date"
              checked={this.props.status.status === 'Will be available on later date'}
            onChange={this.handleChange}
          />
        </Form.Field>
            </Form>
      )
    }
}
