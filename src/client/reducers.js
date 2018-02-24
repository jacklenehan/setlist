import { combineReducers } from 'redux'
import {
  TOGGLE_IMPORT_FORM,
  REQUEST_AUTH,
  RECEIVE_AUTH,
  REQUEST_TRACKS,
  RECEIVE_TRACKS
} from './actions'
import { formatTracks } from './helpers'

const showImport = (state = true, action) => {
  switch(action.type) {
    case TOGGLE_IMPORT_FORM:
      return !state;
    default:
      return state;
  }
}

const isFetching = (state = false, action) => {
  switch(action.type) {
    case REQUEST_TRACKS:
    case REQUEST_AUTH:
      return true;
    case RECEIVE_TRACKS:
    case RECEIVE_AUTH:
      return false;
    default:
      return state;
  }
}

const isAuthorizedWithSpotify = (state = false, action) => {
  switch(action.type) {
    case REQUEST_AUTH:
      return false;
    case RECEIVE_AUTH:
      return true;
    default:
      return state;
  }
}

const spotifyToken = (state = '', action) => {
  switch(action.type) {
    case RECEIVE_AUTH:
      return action.json.token;
    default:
      return state;
  }
}

const tracks = (state = {}, action) => {
  switch(action.type) {
    case RECEIVE_TRACKS:
      return Object.assign(state, formatTracks(action.data.tracks));
    default:
      return state;
  }
}

const setlistApp = combineReducers({
  showImport,
  isFetching,
  isAuthorizedWithSpotify,
  spotifyToken,
  tracks
});

export default setlistApp;
