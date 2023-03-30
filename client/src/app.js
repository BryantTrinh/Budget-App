import * as React from "react";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Budget from "./pages/Budget"; 

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers  }) => {
  const token = localStorage.getItem("auth_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
		<ApolloProvider client={client}>
			<Router>
				<div>
					<Navbar />
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/' element={<Home />} />
						<Route path='/Budget' element={<Budget />} />
						{/* <Route path='/profile' element={<Profile />} /> */}
					</Routes>
				</div>
			</Router>
		</ApolloProvider>
	);
}

export default App;