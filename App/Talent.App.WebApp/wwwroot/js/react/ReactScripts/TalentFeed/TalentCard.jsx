import React from 'react'
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import xhr from '../../service.jsx'
import { loaderData } from '../Layout/BodyWrapper.jsx';
import { Popup, Icon, List, Card, Button, Grid } from 'semantic-ui-react'

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {   
          isDetail: false,
          talent: {},
        }      
      this.detail = this.detail.bind(this);      
    } 
      
  detail(d) {
    var current = this.state.isDetail ? {} : d;
      this.setState(
        preState => ({
          isDetail: !preState.isDetail,
          talent: current,
        }),
      )
    }

  info = (d) => {
    return (
      <React.Fragment>
        <Grid relaxed columns={2}>
          <Grid.Column>
            <img src={d.photoId || 'https://react.semantic-ui.com/images/wireframe/image.png'} alt="" style={{ width: '100%' }} />
          </Grid.Column>
          <Grid.Column>
            <h2><strong>Talent snapshot</strong></h2>
            <p><strong>CURRENT EMPLOYER</strong></p>
            <p>{d.workExperience === [] ? d.workExperience[0].company : ''}</p>
            <br />
            <p><strong>VISA STATUS</strong></p>
            <p>{d.visaStatus || ''}</p>
            <br />
            <p><strong>POSITION</strong></p>
            <p>{d.workExperience === [] ? d.workExperience[0].position : ''}</p>
          </Grid.Column>
        </Grid>
      </React.Fragment>
      )
  }

  cameraIcon = () => {
    return (
      <Icon name='video camera' link onClick={this.detail} />
      )
  }

  render() {

    const items = this.props.data.map(d =>
      (
        <Card fluid>
          <Card.Content>
            <List>
        <List.Item key={d.id}>      
         <List.Content>
                <List.Header as='a'>{d.name} <span className="right floated"><Icon name='star'/></span> </List.Header>
                <List.Description>            
              {this.state.talent.id === d.id ? this.info(this.state.talent) :
                      <video style={{ width: '100%' }} src={d.videoUrl === null ? "https://public.sn.files.1drv.com/y4mvWOelLNVbIlCJztUUCt5KPeUgfQ4Jk2QYxLTkcrQRvG7cSv-m0i-FWhQuK4A1AimX9v38ACZoh1e9YUcgfoNTBvIXcmIjOHkDZR6qf9OrBrN_yslIsLV3wjfZVGSfndg0qm2QJvqlMXBU9YgSGpOk6ubb4iv8ug4xId6LkWw6AeFMne126YSbsGOcQURgebD/night.mp4" : d.videoUrl}   />
              }
                </List.Description>
                <List.Description>
                  <Grid relaxed columns={4}>
                    <Grid.Column>
                        {this.state.talent.id === d.id ?  this.cameraIcon() : <Icon name='user' link onClick={e => this.detail(d, e)} />}
                    </Grid.Column>
                    <Grid.Column>
                      <Icon name='file pdf outline' />
                    </Grid.Column>
                    <Grid.Column>
                  <a href={d.linkedAccounts.linkedIn}><Icon name='linkedin' /></a>    
                    </Grid.Column>
                <Grid.Column>
                  <a href={d.linkedAccounts.github}><Icon name='github' /></a>                      
                    </Grid.Column>
                  </Grid>                    
                </List.Description>
            {d.skills===[]? d.skills.map(s => (
              <Button key={s.id} content={s.name} basic size='mini' />
            )) : "No skills yet"}
      </List.Content>
        </List.Item>
        </List>
          </Card.Content >
        </Card >
            ))
    return (      
           
          <Card.Group>
           {items}
          </Card.Group>
         
           )
    }
}

