import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createVegetable } from 'state/modules/vegetable'
import { VegetableForm } from 'components/VegetableForm'

export class CreateVegetableForm extends Component {
  render() {
    return (
      <div>
        <h2>Create Vegetable</h2>
        <VegetableForm onSubmit={ this.props.createVegetable } />
      </div>
    )
  }
}

const mapActionsToProps = dispatch => ({
  createVegetable: vegetable => dispatch(createVegetable(vegetable))
})

export default connect(null, mapActionsToProps)(CreateVegetableForm)
