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
        }      
      this.detail = this.detail.bind(this);
    }
 
      
    detail() {
      this.setState(
        preState => ({ isDetail: !preState.isDetail }),
      )
    }

  render() {
    const data = [{
      id: "uurere889jkjrke",
      name: "Jacey Well",
      photoId: "",
      workExperience: [{company:"Vicus Digital",position:"Developer"}],
      visaStatus: "Work Visa",
      skills: [{ name: "C#", level: "intermediate" }, { name: "Java", level: "junior" }],
    }]
    const items = data.map(d =>
      (
        <List.Item key={d.id}>      
      <List.Content>
                <List.Header as='a'>{d.name} <span className="right floated"><Icon name='star'/></span> </List.Header>
                <List.Description>
              {this.state.isDetail ?
                <Grid relaxed columns={2}>
                  <Grid.Column>
                    <img src={d.photoId || 'https://react.semantic-ui.com/images/wireframe/image.png'} alt="" style={{width:'100%'}} />
                  </Grid.Column>
                  <Grid.Column>
                    <h2><strong>Talent snapshot</strong></h2>
                    <p><strong>CURRENT EMPLOYER</strong></p>
                    <p>{d.workExperience[0].company}</p>
                    <br />
                    <p><strong>VISA STATUS</strong></p>
                    <p>{d.visaStatus}</p>
                    <br />
                    <p><strong>POSITION</strong></p>
                    <p>{d.workExperience[0].position}</p>
                  </Grid.Column>
                </Grid>
                : <video style={{ width: '100%' }} src="https://public.sn.files.1drv.com/y4mnnSQBwEldYA_PUa6OFGO2HNfyA4KdDU7E4KdKWHkBLRUahF8nOVhbhQDd2CEh_r0c3lWGd0nEQBRG63CytB_CYYIL4y4t_RxKo8qun_pHfovExYf7cL3EzZETqBH9NTeUeuoV0Jy5XYW0OAC2Hh2rvzLEwi1mt_7_nJiHnHwfrPjsX5i85ZtMKVG8X240fP5/night.mp4?access_token=EwAAA61DBAAUcSSzoTJJsy%2bXrnQXgAKO5cj4yc8AAcJoAsgxnl8EhEYkst6qfJiy7kk07ashwQEZq8KuhysQgybn883RXD2dOtz2xK2c65W8sxE4WJBUmXFPQ2v0YyKa%2fiVlunllCUZPnFMj2b%2fApki2zOMp76%2bnnPmTWAl05KaJoLIRssgCeUSeTne3JK9sCMRm2Yb9cnTCZ1YOJK9tVJvO0q8R9MGg1m%2bUybGNb0Xe53%2bjpsZFJLQPGgRlBKyI2AzuIk%2bXBJHcoqmSyDM1xqic2Jz9TL8bQnp0mfMTeDN7AzvJxSnyYiQc855cuNAaH6ZJpqtmKl%2bAAfAhGJ0hcEMb%2bOf2XipajeM29kQvMHi76ZqqUSbzw7RuXO5xPdcDZgAACDrZw%2fy4ijFn0AHBpSb3cy2%2bEHLrVXNcE1N1IrZUxoF8WV5ER8fXO1pfklCtp0slCQ71ljEitduQCrnHRFgOTw4R3KU4DIatxsC%2bgqdm7YB2oEBVe758EN%2f%2bPWmQxyvaxNsEBhUuBH6BApfFzwYkXDGsq9nqiklOs8ye4JcaWnWUFMb%2fA%2byqC%2bFcoT18IAoofcy6wdav4wT0yPLktysa%2fTBc4J%2bWaV76PoHRflCtALIKgKmGHXLbs0P7AYbqdgZyzDSY%2fyfFzdjxqvGoSLjwh%2bjeoLo9SAq87N7M4LIgcSBzhFTZ1D2S72MwXY2u3tV%2bwqlUkzDZ18nZqos1unt9%2f0GzPD3U2bE%2bGsN8UblyOB5PCc6yjGYScX%2bSpW4jfdXwPZzIxysvy5AoF8E2BP%2bWXaFOTI9Lku2IwZI235Ze6ioIUE%2ffXvCkXq2qXpPXCq8z7%2b5UHeGlJqo%2bzCpmn740n%2boxZX6bOi2%2fsiyM4lms8cGy0pVkRfL3cIGNm2dN%2fI766UcLUeM7EP%2b8qBGg8Zg%2fMJeoFUpwE4UO2ynuwaJGh8KTSQRjlQOYmA4apNa6acLNnvJIwbcIhy0VtLYbZmILuLg%2f%2boFwVKgt0VXbga8HtHSJqxFrHEwHG1Gh%2bQUC" autoplay />
                  }
                </List.Description>
                <List.Description>
                  <Grid relaxed columns={4}>
                    <Grid.Column>
                  {this.state.isDetail ? <Icon name='video camera' link onClick={this.detail} /> : <Icon name='user' link onClick={this.detail} />}
                    </Grid.Column>
                    <Grid.Column>
                      <Icon name='file pdf outline' />
                    </Grid.Column>
                    <Grid.Column>
                      <Icon name='linkedin' />
                    </Grid.Column>
                    <Grid.Column>
                      <Icon name='github' />
                    </Grid.Column>
                  </Grid>                    
                </List.Description>
            {d.skills.map(s => (
              <Button key={s.id} content={s.name} basic size='min' />
            ))}
      </List.Content>
    </List.Item>
            ))
    return (      
           <Card fluid>           
           <Card.Content>
           <List>
           {items}
           </List>
           </Card.Content>
        </Card>
        
           )
    }
}

