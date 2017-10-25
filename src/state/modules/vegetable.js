import * as blockstack from 'blockstack'
import { DATA_PATHS } from 'common/constants/blockstack'
import shortId from 'shortid';

const FETCH_VEGETABLES = 'vegetable/FETCH_VEGETABLES'
const FETCH_VEGETABLES_SUCCESS = 'vegetable/FETCH_VEGETABLES_SUCCESS'
const FETCH_VEGETABLES_FAILED = 'vegetable/FETCH_VEGETABLES_FAILED'

const CREATE_VEGETABLE = 'vegetable/CREATE_VEGETABLE'
const CREATE_VEGETABLE_SUCCESS = 'vegetable/CREATE_VEGETABLE_SUCCESS'
const CREATE_VEGETABLE_FAILED = 'vegetable/CREATE_VEGETABLE_FAILED'

const EDIT_VEGETABLE = 'vegetable/EDIT_VEGETABLE'
const EDIT_VEGETABLE_SUCCESS = 'vegetable/EDIT_VEGETABLE_SUCCESS'
const EDIT_VEGETABLE_FAILED = 'vegetable/EDIT_VEGETABLE_FAILED'

const DELETE_VEGETABLE = 'vegetable/DELETE_VEGETABLE'
const DELETE_VEGETABLE_SUCCESS = 'vegetable/DELETE_VEGETABLE_SUCCESS'
const DELETE_VEGETABLE_FAILED = 'vegetable/DELETE_VEGETABLE_FAILED'

const initialState = {
  vegetables: {},
  isLoading: false,
  isCreatingVegetable: false,
  isEditingVegetable: false
}

// {{ vegetable id }} {
//   type: {{ string }}
//   color: {{ string }}
//   size: {{ string }}
// }

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_VEGETABLES:
      return {
        ...state,
        isLoading: true
      }
    case FETCH_VEGETABLES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        vegetables: action.vegetables
      }
    case FETCH_VEGETABLES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case CREATE_VEGETABLE:
      return {
        ...state,
        isCreatingVegetable: true
      }
    case CREATE_VEGETABLE_SUCCESS:
      return {
        ...state,
        isCreatingVegetable: false,
        vegetables: {
          ...state.vegetables,
          [ action.id ]: action.vegetable
        }
      }
    case CREATE_VEGETABLE_FAILED:
      return {
        ...state,
        isCreatingVegetable: false,
        error: action.error
      }
    case EDIT_VEGETABLE:
      return {
        ...state,
        isEditingVegetable: true
      }
    case EDIT_VEGETABLE_SUCCESS:
      return {
        ...state,
        isEditingVegetable: false,
        vegetables: {
          ...state.vegetables,
          [ action.id ]: action.vegetable
        }
      }
    case EDIT_VEGETABLE_FAILED:
      return {
        ...state,
        isEditingVegetable: false,
        error: action.error
      }
    case DELETE_VEGETABLE:
      return {
        ...state,
        isDeletingVegetable: true
      }
    case DELETE_VEGETABLE_SUCCESS:
      const updated = { ...state.vegetables }
      delete updated[action.id]

      return {
        ...state,
        isDeletingVegetable: false,
        vegetables: {
          ...updated
        }
      }
    case DELETE_VEGETABLE_FAILED:
      return {
        ...state,
        isDeletingVegetable: false,
        error: action.error
      }
    default:
      return state
  }
}

const addItemToVegetables = (vegetables, vegetable, id) => ({
  ...vegetables,
  [ id ]: vegetable
})

const removeItemFromVegetables = (vegetables, id) => {
  const updated = { ...vegetables }
  delete updated[id]
  return updated
}

const validateNewVegetable = (vegetables, vegetable, id) => {
  if (vegetables[id]) throw new Error('A vegetable with that ID already exists.');
  if (name(vegetables, vegetable.name)) {
    throw new Error('You already have a vegetable with that name. Pick another!');
  }
  return vegetables;
}

const name = (vegetables, compare) => (
  Object.keys(vegetables).filter(key => (
    vegetables[key] && (vegetables[key].title === compare)
  )).length > 0
)

const validateEditVegetable = (vegetables, vegetable, id) => {
  if (!vegetables[id]) throw new Error('Oops, that vegetable doesn\'t exist!');
  if (name(vegetables, vegetable.name)) {
    throw new Error('You already have a vegetable with that name. Pick another!');
  }
  return vegetables;
}

const validateDeleteVegetable = (vegetables, id) => {
  if (!vegetables[id]) throw new Error('Oops, that vegetable doesn\'t exist!');
  return vegetables;
}

export const fetchVegetables = dispatch => {
  dispatch(fetchingVegetables())

  return blockstack.getFile(DATA_PATHS.vegetables)
    .then( file => {
      const vegetables = JSON.parse(file) || {}
      dispatch(fetchVegetablesSuccess(vegetables))
      return vegetables;
    })
    .catch( error => dispatch(fetchVegetablesFailed(error)) )
}

export const createVegetable = vegetable => dispatch => {
  const id = shortId.generate();

  dispatch({ type: CREATE_VEGETABLE });

  fetchVegetables(dispatch)
    .then( vegetables => validateNewVegetable(vegetables, vegetable, id) )
    .then( vegetables => addItemToVegetables(vegetables, vegetable, id) )
    .then( updated => blockstack.putFile(DATA_PATHS.vegetables, JSON.stringify(updated)) )
    .then( () => dispatch(createVegetableSuccess(vegetable, id)) )
    .catch( err => dispatch(createVegetableFailed(err)) )
}

export const editVegetable = (id, vegetable) => dispatch => {
  dispatch({ type: EDIT_VEGETABLE });

  fetchVegetables(dispatch)
    .then( vegetables => validateEditVegetable(vegetables, vegetable, id) )
    .then( vegetables => addItemToVegetables(vegetables, vegetable, id) )
    .then( updated => blockstack.putFile(DATA_PATHS.vegetables, JSON.stringify(updated)) )
    .then( () => dispatch(editVegetableSuccess(vegetable, id)) )
    .catch( err => dispatch(editVegetableFailed(err)) )
}

export const deleteVegetable = id => dispatch => {
  dispatch({ type: DELETE_VEGETABLE, id });

  fetchVegetables(dispatch)
    .then( vegetables => validateDeleteVegetable(vegetables, id) )
    .then( vegetables => removeItemFromVegetables(vegetables, id) )
    .then( updated => blockstack.putFile(DATA_PATHS.vegetables, JSON.stringify(updated)) )
    .then( () => dispatch(deleteVegetableSuccess(id)) )
    .catch( err => dispatch(deleteVegetableFailed(err)) )
}

const createVegetableSuccess = (vegetable, id) => ({
  type: CREATE_VEGETABLE_SUCCESS,
  vegetable,
  id
})

const createVegetableFailed = error => ({
  type: CREATE_VEGETABLE_FAILED,
  error
})

const editVegetableSuccess = (vegetable, id) => ({
  type: EDIT_VEGETABLE_SUCCESS,
  vegetable,
  id
})

const editVegetableFailed = error => ({
  type: EDIT_VEGETABLE_FAILED,
  error
})

const deleteVegetableSuccess = id => ({
  type: DELETE_VEGETABLE_SUCCESS,
  id
})

const deleteVegetableFailed = error => ({
  type: DELETE_VEGETABLE_FAILED,
  error
})

const fetchingVegetables = () => ({
  type: FETCH_VEGETABLES
})

const fetchVegetablesSuccess = vegetables => ({
  type: FETCH_VEGETABLES_SUCCESS,
  vegetables
})

const fetchVegetablesFailed = error => ({
  type: FETCH_VEGETABLES_FAILED,
  error
})
