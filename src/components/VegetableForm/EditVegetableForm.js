import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editVegetable } from 'state/modules/vegetable'
import { VegetableForm } from 'components/VegetableForm'

export class EditVegetableForm extends Component {
  render() {
    return (
      <div>
        <h2>Create Vegetable</h2>
        <VegetableForm onSubmit={ this.props.editVegetable } />
      </div>
    )
  }
}

const mapActionsToProps = dispatch => ({
  editVegetable: vegetable => dispatch(editVegetable(vegetable))
})

export default connect(null, mapActionsToProps)(EditVegetableForm)
