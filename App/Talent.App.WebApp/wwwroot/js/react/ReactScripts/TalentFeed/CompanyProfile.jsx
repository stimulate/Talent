import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    return (
      <Card.Group itemsPerRow={1} centered>
        <Card key={this.props.loadEmployers.id}>
          <Card.Content>
            <Image src={this.props.loadEmployers.profilePhotoUrl || "http://www.collabrus.com/collabrus_blog/wp-content/uploads/2013/08/building.jpg"} size='small' />
            <Card.Header>{this.props.loadEmployers.companyContact.name}</Card.Header>
            <Card.Meta><Icon name='map marker alternate' />{' '}{`${this.props.loadEmployers.companyContact.location.city} ${this.props.loadEmployers.companyContact.location.country}`}</Card.Meta>
            <Card.Description>{this.props.loadEmployers.displayProfile || "there is no Description yet"}</Card.Description>           
            <hr />
            <br />
            <Icon name='phone' /> :{' '} {this.props.loadEmployers.companyContact.phone}
            <br />
            <Icon name='mail' /> :{' '} {this.props.loadEmployers.companyContact.email}
                              
                  </Card.Content>
               </Card> 
              </Card.Group>)
    }
}
