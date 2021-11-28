import "../styles/globals.css";

import { NextPage } from "next";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { AuthProvider } from "../context/auth";
import { MyApolloProvider } from "../context/apollo";
import { StatusManageProvider } from "../context/statusManage";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <MyApolloProvider>
        <StatusManageProvider>
          <Component {...pageProps} />
        </StatusManageProvider>
      </MyApolloProvider>
    </AuthProvider>
  );
};

export default MyApp;
