import { Provider } from "react-redux";

import { store } from "./redux";
import Routes from "./routes";
import Fetching from "./pages/Fetching";

function App() {
  return (
    <Provider store={store}>
      <Fetching>
        <Routes />
      </Fetching>
    </Provider>
  );
}

export default App;
