import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: [],
  foodType: [],
  foodTypeCalled: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setFoodType: (state, action) => {
      state.foodType = action.payload;
    },
    setFoodTypeCalled: (state, action) => {
      state.foodTypeCalled.push(action.payload);
    },
    setMenu: (state, action) => {
      if (state.menu.length === 0) {
        return { ...state, menu: [...action.payload] };
      } else {
        let data = [];
        action.payload.forEach((e) => {
          if (!state.menu.find((f) => f._id === e._id)) {
            data.push(e);
          }
        });
        return { ...state, menu: [...state.menu, ...data] };
      }
    },
    addFood: (state, action) => {
      const data = action.payload;
      if (!state.foodType.find((type) => type === data.type)) {
        return {
          ...state,
          menu: [...state.menu, data],
          foodType: [...state.foodType, data.type],
          foodTypeCalled: [...state.foodTypeCalled, data.type],
        };
      } else {
        if (!state.menu.find((f) => f._id === data._id)) {
          return { ...state, menu: [...state.menu, action.payload] };
        }
      }
    },
    addFoodByOrderPage: (state, action) => {
      const data = action.payload;
      if (!state.menu.find((f) => f._id === data._id)) {
        return { ...state, menu: [...state.menu, action.payload] };
      }
    },
    deleteFood: (state, action) => {
      const data = action.payload;
      if (state.menu.filter((food) => food.type === data.type).length === 1) {
        return {
          ...state,
          menu: state.menu.filter((food) => food._id !== data._id),
          foodType: state.foodType.filter((food) => food !== data.type),
          foodTypeCalled: state.foodTypeCalled.filter(
            (food) => food !== data.type
          ),
        };
      } else
        return {
          ...state,
          menu: state.menu.filter((food) => food._id !== data._id),
        };
    },
    updateFood: (state, action) => {
      const data = action.payload;
      const food1 = state.menu.find((food) => food._id === data._id);
      const typeExists = state.foodType.find((t) => t === data.type);
      const typeEqualOne =
        state.menu.filter((food) => food.type === food1.type).length === 1;

      // Update to make new type and delete type if not more than one

      if (food1.type !== data.type) {
        if (typeExists) {
          if (typeEqualOne) {
            return {
              ...state,
              foodType: state.foodType.filter((e) => e !== food1.type),
              menu: state.menu.map((e) => {
                if (e._id === data._id) return data;
                else return e;
              }),
            };
          } else
            return {
              ...state,
              menu: state.menu.map((e) => {
                if (e._id === data._id) return data;
                else return e;
              }),
            };
        } else {
          if (typeEqualOne) {
            return {
              ...state,
              foodType: state.foodType.map((t) => {
                if (t === food1.type) return data.type;
                else return t;
              }),
              foodTypeCalled: [...state.foodTypeCalled, data.type],
              menu: state.menu.map((e) => {
                if (e._id === data._id) return data;
                else return e;
              }),
            };
          } else
            return {
              ...state,
              foodType: [...state.foodType, data.type],
              foodTypeCalled: [...state.foodTypeCalled, data.type],
              menu: state.menu.map((e) => {
                if (e._id === data._id) return data;
                else return e;
              }),
            };
          // return {
          //   ...state,
          //   // foodType: [...state.foodType, data.type],
          //   // foodTypeCalled: [...state.foodTypeCalled, data.type],
          //   menu: state.menu.map((e) => {
          //     if (e._id === data._id) return data;
          //     else return e;
          //   }),
          // };
        }
      } else {
        return {
          ...state,
          menu: state.menu.map((e) => {
            if (e._id === data._id) return data;
            else return e;
          }),
        };
      }
    },
  },
});

export const {
  setFoodType,
  setFoodTypeCalled,
  setMenu,
  addFood,
  deleteFood,
  updateFood,
  addFoodByOrderPage,
} = menuSlice.actions;

export default menuSlice.reducer;
