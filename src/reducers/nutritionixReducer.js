import { NUTRITIONIX_INSTANT_SUCCESS } from './../actions/NutritionixActions';

const initialState = {
  foodList: [],
};
export default function record(state = initialState, action) {
  switch (action.type) {
    case NUTRITIONIX_INSTANT_SUCCESS:
      return { ...state, foodList: action.payload };
    default:
      return state;
  }
};
