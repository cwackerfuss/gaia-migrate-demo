import React from 'react'
import { Field, reduxForm } from 'redux-form'

// {{ vegetable id }} {
//   type: {{ string }}
//   color: {{ string }}
//   size: {{ string }}
// }

const VegetableForm = props => {
  const { handleSubmit } = props
  return (
    <form onSubmit={ handleSubmit }>
      <div>
        <label htmlFor="type">Type</label>
        <Field name="type" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="color">Color</label>
        <Field name="color" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="size">Size</label>
        <div>
          <Field name="size" component="select">
            <option />
            <option value="SM">Small</option>
            <option value="MD">Medium</option>
            <option value="LG">Large</option>
          </Field>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default reduxForm({ form: 'vegetable' })(VegetableForm)
