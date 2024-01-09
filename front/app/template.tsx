import "../styles/globals.css";
import { MyApolloProvider } from "../context/apollo";
import { AuthProvider } from "../context/auth";
import { StatusManageProvider } from "../context/statusManage";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MyApolloProvider>
        <StatusManageProvider>
          {children}
        </StatusManageProvider>
      </MyApolloProvider>
    </AuthProvider>)
}
