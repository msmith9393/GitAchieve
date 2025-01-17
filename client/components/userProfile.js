import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import axios from 'axios';
import moment from 'moment';

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      friends: [],
      userEvents: [],
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.props.user.username,
          'Authorization': `token ${localStorage.token}`
        }
      }
    };
  }
  
  componentWillUnmount() {
    this.props.actions.searchUserEvents([]);
  }

  componentWillMount() {
    this.fetchFriends();
    this.fetchEvents.call(this)
    this.fetchHistory()
  }

  fetchHistory() {
    var competitions = this.props.pastCompetitions[0].map(comp => {
      var competitor, champion;
      if (comp.primary_user_id === this.props.user.id) {
        competitor = comp.secondary_user_id;
      } else {
        competitor = comp.primary_user_id;
      }
      if (comp.winner === 1) {
        champion = 'Tie';
      } else if (comp.winner === this.props.user.id) {
        champion = this.props.user.username;
      } else {
        champion = comp.secondary_user_id;
      }
      return {
        competitionEnd: comp.competition_end,
        competitor,
        champion
      };
    });
    var result = [];
    var length = competitions.length;
    competitions.sort((a, b) => (new Date(a.competitionEnd) > new Date(b.competitionEnd)))
    .forEach((comp) => {
      axios.get(`${ROOT_URL}/api/v1/users/${comp.competitor}`)
        .then((res, index) => {
          var champion = (res.data.id === comp.champion) ? res.data.username : comp.champion;
          // var newHistory = this.state.history.concat({ champion: champion, compei})
          result.push({champion, competitor: res.data.username, competitorAvatar: res.data.avatar_url});
          if (result.length === length) {
            this.setState({history: result});
          }
        });
    });
  }

  fetchFriends() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/friends`)
      .then(data => this.setState({friends: data.data}))
  }

  fetchEvents() {
    if (window.location.pathname.includes(this.props.user.username)) {
      axios.get(`https://api.github.com/users/${this.props.user.username}/events`, this.state.options.headers)
        .then(response => this.setState({userEvents: response.data}))
    } else {
      let slicedName = window.location.pathname.slice(1);
      let username = slicedName.slice(0, slicedName.indexOf('/'))
      axios.get(`https://api.github.com/users/${username}/events`, this.state.options.headers)
        .then(response => this.setState({userEvents: response.data}))
    }
  }

  eventTypeFilter(event) {
    switch (event.type) {
      case 'PushEvent':
        return (
          <div className="data-result-container event-commits">
            <img src="./../static/assets/circle-star-1-1.svg" height="15px" width="15px"/>
            <h3 className="event-title">You pushed {event.payload.commits.length} commits to {event.repo.name}</h3>
          </div>
         );
      case 'PullRequestEvent':
        return (
          <div className="data-result-container">
            <img src="./../static/assets/git-pull-request-1-2.png" />
            <h3>You {event.payload.action} a pull-request</h3>
            <p>number of commits: {event.payload.pull_request.commits}</p>
            <p>number of changed files: {event.payload.pull_request.changed_files}</p>
            <p>number of additions: {event.payload.pull_request.additions}</p>
            <p>number of deletions: {event.payload.pull_request.deletions}</p>
          </div>
        );
      default:
        return (<div></div>);
    }
  }

  renderEvents() {
    if (this.props.searchUserEvents.length > 0) {
      return this.props.searchUserEvents.map((event, index) => {
        if (event.type === 'PushEvent' || event.type === 'PullRequestEvent') {
          return (
            <div key={index} className="search-result-container" >
              <h3 className="event-title">{event.type}</h3>
              <span className="event-title"> at </span>
              <h3 className="event-title">{event.repo.name}</h3>
              <span>{event.created_at}</span>
              {this.eventTypeFilter(event)}
            </div>
          )
        }
      });
    } else {
      return this.state.userEvents.map((event, index) => {
        if (event.type === 'PushEvent' || event.type === 'PullRequestEvent') {
          return (
            <div key={index} className="search-result-container" >
              <span className="font-medium-gray font-weight-light fonts-size-regular">{moment(new Date(event.created_at)).fromNow()}</span>
              <div className="spacer-5px"/>
              {this.eventTypeFilter(event)}
            </div>
          )
        }
      });
    }
  }

  renderHistory() {
    return (
      <table className="child history-table">
        <tbody>
        {this.state.history.map((comp, ind) =>
          <tr key={ind}>
            <td><img src={comp.competitorAvatar} className="user-avatar-med" /><span className="block">{comp.competitor}</span></td>

            {comp.champion === this.props.user.username ?
              <td><img src="./../static/assets/trophy-1-3.png" height="50px" width="44px" className="logo"/></td>
              : <td><img src="./../static/assets/surrender.png" height="50px" width="50px" className="logo"/></td>
            }
            {comp.champion === this.props.user.username ?
              <td>You Won!</td> : <td>You Lost</td>
            }
          </tr>
        )}
        </tbody>
      </table>
    )
  }

  renderFriends() {
    if (this.state.friends.length !== 0) {
      return this.state.friends.map(friend => (
        <div key={friend.id} className="competitor-card data-result-container">
          <img src={friend.avatar_url} className="user-avatar-med" />
          <h3 className="font-dark-gray">{friend.username}</h3>
        </div>
      ));
    }
  }

  render() {
    return (
      <div className="data-results-container">
        <div className="data-result-container">
          <h2>Competition History</h2>
          <div>
            <div className="comp-result-container history-img">
              <img src={this.props.user.avatar_url} className="user-avatar-med2 border-1px-white" />
              <h3>{this.props.user.username}</h3>
            </div>
            <div className="comp-result-container comp-history">
              {this.renderHistory()}
            </div>
          </div>
        </div>
        <div className="data-result-container">
          <h2>Friends</h2>
          {this.renderFriends()}
        </div>
        <div className="comp-result-container full-width">
          {this.renderEvents()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);