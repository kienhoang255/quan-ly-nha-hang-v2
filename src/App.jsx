import { Provider } from "react-redux";

import { store } from "./redux";
import Routes from "./routes";
import Fetching from "./pages/Fetching";
import PusherComponent from "./pusher";

function App() {
  return (
    <Provider store={store}>
      <PusherComponent />
      <Fetching>
        <Routes />
      </Fetching>
    </Provider>
  );
}

export default App;
