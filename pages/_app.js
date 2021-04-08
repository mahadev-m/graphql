import "../styles/globals.css";
//import "tailwindcss/tailwind.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
function MyApp({ Component, pageProps }) {
  const client = new ApolloClient({
    uri: "https://many-rodent-41.hasura.app/v1/graphql",
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
