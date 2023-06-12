import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stage: [],
  table: [],
  stageCalled: [],
  tableImage: {},
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setStage: (state, action) => {
      state.stage = action.payload;
    },
    setStageCalled: (state, action) => {
      state.stageCalled.push(action.payload);
    },
    setTable: (state, action) => {
      // state.table.push(...action.payload);
      const table = action.payload.table;
      const booking = action.payload.booking;
      const deathTime = action.payload.deathTime;

      return {
        ...state,
        table: [
          ...state.table,
          ...table.map((t) => {
            const findBooking = booking.find((b) => b.id_table === t._id);

            if (
              findBooking &&
              t.status === "empty" &&
              deathTime + 4 <= findBooking.timeCheckIn
            ) {
              return {
                status: "booking",
                name: t.name,
                _id: t._id,
                id_bill: t.id_bill,
                numOfPeople: t.numOfPeople,
                stage: t.stage,
              };
            } else return t;
          }),
        ],
      };
    },
    addTable: (state, action) => {
      const data = action.payload;
      if (!state.stage.find((stage) => stage === data.stage)) {
        return {
          ...state,
          table: [...state.table, data],
          stage: [...state.stage, data.stage],
          stageCalled: [...state.stageCalled, data.stage],
        };
      } else {
        if (!state.table.find((f) => f._id === data._id)) {
          return { ...state, table: [...state.table, action.payload] };
        }
      }
    },
    updateTable: (state, action) => {
      const data = action.payload;
      const stage1 = state.table.find((s) => s._id === data._id);
      const stageExists = state.stage.find((t) => t === data.stage);
      const typeEqualOne =
        state.table.filter((food) => food.stage === stage1.stage).length === 1;

      if (stage1.stage !== data.stage) {
        if (stageExists) {
          if (typeEqualOne) {
            return {
              ...state,
              stage: state.stage.filter((e) => e !== stage1.stage),
              table: state.table.map((e) => {
                if (e._id === data._id) return data;
                else return e;
              }),
            };
          } else
            return {
              ...state,
              table: state.table.map((e) => {
                if (e._id === data._id) return data;
                else return e;
              }),
            };
        } else {
          if (typeEqualOne) {
            return {
              ...state,
              stage: state.stage.map((t) => {
                if (t === stage1.stage) return data.stage;
                else return t;
              }),
              stageCalled: [...state.stageCalled, data.stage],
              table: state.table.map((e) => {
                if (e._id === data._id) return data;
                else return e;
              }),
            };
          } else
            return {
              ...state,
              stage: [...state.stage, data.stage],
              stageCalled: [...state.stageCalled, data.stage],
              table: state.table.map((e) => {
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
    deleteTable: (state, action) => {
      const data = action.payload;
      if (
        state.table.filter((food) => food.stage === data.stage).length === 1
      ) {
        return {
          ...state,
          table: state.table.filter((stage) => stage._id !== data._id),
          stage: state.stage.filter((stage) => stage !== data.stage),
          stageCalled: state.stageCalled.filter(
            (stage) => stage !== data.stage
          ),
        };
      } else
        return {
          ...state,
          table: state.table.filter((stage) => stage._id !== data._id),
        };
    },

    setTableImage: (state, action) => {
      return {
        ...state,
        tableImage: {
          ...state.tableImage,
          [action.payload.id_table]: action.payload,
        },
      };
    },
    updateTableImage: (state, action) => {
      return {
        ...state,
        tableImage: {
          ...state.tableImage,
          [action.payload._id]: {
            ...state.tableImage[action.payload._id],
            ...action.payload,
          },
        },
      };
    },

    addTableImageOptions: (state, action) => {
      return {
        ...state,
        tableImage: {
          ...state.tableImage,
          [action.payload._id]: {
            ...state.tableImage[action.payload._id],
            options: [
              ...state.tableImage[action.payload._id].options,
              action.payload.option,
            ],
          },
        },
      };
    },

    updateTableImageOptions: (state, action) => {
      state.tableImage[action.payload._id].options.splice(
        action.payload.index,
        1,
        action.payload.option
      );
    },

    removeTableImageOptions: (state, action) => {
      state.tableImage[action.payload._id].options.splice(
        action.payload.index,
        1
      );
    },
  },
});

export const {
  setStage,
  setStageCalled,
  setTable,
  addTable,
  updateTable,
  deleteTable,
  updateTableInfo,
  setTableImage,
  updateTableImage,
  addTableImageOptions,
  updateTableImageOptions,
  removeTableImageOptions,
} = tableSlice.actions;

export default tableSlice.reducer;
