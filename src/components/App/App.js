import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as blockstack from 'blockstack'
import { checkIfUserIsSignedIn } from 'state/modules/auth'
import { checkForUpdates } from 'blockstack-migrations'
import * as blockstackMigrations from 'migrations'
import { fetchVegetables } from 'state/modules/vegetable'
import CreateVegetable from 'components/VegetableForm'
import './App.scss'

export class App extends Component {
  componentWillMount() {
    const signedIn = this.props.checkIfUserIsSignedIn()
    if (signedIn) {
      this.props.fetchVegetables()
      checkForUpdates(blockstackMigrations)
    }
  }

  signIn = () => {
    blockstack.redirectToSignIn()
  }

  render() {
    return (
      <div className='container app'>
        <a className='button button-primary u-pull-right' onClick={ this.signIn }>Sign in</a>
        <CreateVegetable />
      </div>
    )
  }
}

const mapActionsToProps = dispatch => ({
  checkIfUserIsSignedIn: () => dispatch(checkIfUserIsSignedIn()),
  fetchVegetables: () => fetchVegetables(dispatch),
})

export default connect(null, mapActionsToProps)(App)
