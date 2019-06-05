import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'
import xhr from '../../service.jsx'
import TalentCard from '../TalentFeed/TalentCard.jsx'
import { Loader } from 'semantic-ui-react'
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx'
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx'
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx'

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        const loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {            
          loaderData: loader,
          loadTalents:[],
            loadingFeedData: false,
            loadEmployers:  {
                            companyContact: {
                              email: "",
                              firstName: '',
                              lastName: '',
                              location: { country: "", city: "" },
                              name: "",
                              phone: "",
                            },
                            displayProfile: false,
                            id: "",
                            primaryContact: {
                              email: "",
                              firstName: "",
                              lastName: "",
                              location: { country: '', city: '' },
                              name: '',
                              phone: "",
                            },
                            profilePhoto: '',
                            profilePhotoUrl: '',
                            skills: [],
                            length: 0,
                            videoName: '',
                            videoUrl: "",
                          },
        }
      this.loadData = this.loadData.bind(this);
      this.loadTalentData = this.loadTalentData.bind(this);
      this.init = this.init.bind(this);

  };
  async loadData() {
    var link = 'http://localhost:60290/profile/profile/getEmployerProfile';
    var res = await xhr.get(link);

    this.setState({
      loadEmployers: res.data.employer
    });
    console.log("company", res);
  }

  async loadTalentData() {
    var link = 'http://localhost:60290/profile/profile/getTalentList';
    var res = await xhr.get(link);

    console.log("talentls", res.data.data);
    if (res != null) {
      this.setState({
        loadTalents: res.data.data,
      })
    }    
  }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });
    }

    componentDidMount() {
      this.loadData();
      this.loadTalentData();
        this.init()
    };

   
    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
            <div className='ui grid container'>
              <div className="column four wide">
                <CompanyProfile loadEmployers={this.state.loadEmployers} />
                </div>
              <div className="column eight wide">
                <TalentCard data={this.state.loadTalents}  />
                </div>
                <div className="column four wide">                
                <div className="content">
                  <div className="center aligned header">Follow Talent</div>
                  <div className="ui items following-suggestion">
                    <div className="item">
                      <div className="ui image">
                        <img className="ui circular image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                      </div>
                      <div className="content">
                        <a className="">Veronika Ossi</a>
                        <button className="ui primary basic button"><i className="icon user"></i>Follow</button>
                      </div>
                    </div>
                    <div className="item">
                      <div className="ui image">
                        <img className="ui circular image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                      </div>
                      <div className="content">
                        <a className="">Veronika Ossi</a>
                        <button className="ui primary basic button"><i className="icon user"></i>Follow</button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
            </div>
            </BodyWrapper>
        )
    }
}
