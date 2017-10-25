import * as blockstack from 'blockstack'
import * as blockstackConstants from 'common/constants/blockstack'

const SIGN_IN_SUCCESS = 'auth/SIGN_IN_SUCCESS'
const SIGN_IN_FAILED = 'auth/SIGN_IN_FAILED'
const SIGN_OUT = 'auth/SIGN_OUT'

const initialState = {
  signedIn: false,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        signedIn: true,
        user: action.user,
      }
    case SIGN_IN_FAILED:
      return {
        ...state,
        signedIn: false,
        user: null
      }
    default:
      return state
  }
}

export function checkIfUserIsSignedIn() {
  return dispatch => {
    const signedIn = blockstack.isUserSignedIn();
    if (signedIn) {
      const userData = blockstack.loadUserData()
      const user = new blockstack.Person(userData.profile)
      user.username = userData.username

      dispatch(signInSuccess(user))
    } else if (blockstack.isSignInPending()) {
      blockstack
        .handlePendingSignIn(blockstackConstants.NAMES_ENDPOINT)
        .then(userData => {
          window.location = window.location.origin
        })
    }

    return signedIn;
  }
}

export function signUserOut() {
  blockstack.signUserOut();
  return signOut();
}

const signOut = () => ({
  type: SIGN_OUT
})

const signInSuccess = user => ({
  type: SIGN_IN_SUCCESS,
  user
})
