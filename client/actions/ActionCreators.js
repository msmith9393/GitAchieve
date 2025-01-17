import * as types from './actionTypes';

export default {
  authUser: () => {
    return {
      type: types.AUTH_USER
    }
  },
  unAuthUser: () => {
    return {
      type: types.UNAUTH_USER
    }
  },
  querySearch: searchResults => {
    return {
      type: types.QUERY_SEARCH,
      searchResults
    }
  },
  inputSearch: searchInput => {
    return {
      type: types.INPUT_SEARCH,
      searchInput
    }
  },
  searchUserEvents: userEvents => {
    return {
      type: types.SEARCH_USER_EVENTS,
      userEvents
    }
  },
  chooseSearchResult: chosenSearchResult => {
    return {
      type: types.CHOOSE_SEARCH_RESULT,
      chosenSearchResult
    }
  },
  getUserContribs: contributions => {
    return {
      type: types.GET_USER_CONTRIBS,
      contributions
    }
  },
  addCompetitorData: competitorData => {
    return {
      type: types.ADD_COMPETITOR_DATA,
      competitorData
    }
  },
  addDailyCompetitorData: dailyCompetitorData => {
    return {
      type: types.ADD_DAILY_COMPETITOR_DATA,
      dailyCompetitorData
    }
  },
  addCompetitor: competitor => {
    return {
      type: types.ADD_COMPETITOR,
      competitor
    }
  },
  chooseWeapon: weapon => {
    return {
      type: types.CHOOSE_WEAPON,
      weapon
    }
  },
  receivedFriendRequests: friends => {
    return {
      type: types.RECEIVED_FR,
      receivedRequests: friends
    }
  },
  sentFriendRequests: friends => {
    return {
      type: types.SENT_FR,
      sentRequests: friends
    }
  },
  confirmedFriendRequests: friends => {
    return {
      type: types.CONFIRMED_FR,
      confirmedRequests: friends
    }
  },
  confirmedFriendRequests2: friends => {
    return {
      type: types.CONFIRMED_FR2,
      confirmedRequests2: friends
    }
  },
  pastCompetitions: competitions => {
    return {
      type: types.PAST_COMPETITIONS,
      pastCompetitions: competitions
    }
  },
  yesCompetitions: () => {
    return {
      type: types.YES_COMPETITIONS
    }
  }
};
