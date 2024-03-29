import "../styles/globals.css";

import { MyApolloProvider } from "../context/apollo";
import { AuthProvider } from "../context/auth";
import { StatusManageProvider } from "../context/statusManage";

export const metadata = {
  title: 'Alp',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MyApolloProvider>
            <StatusManageProvider>
              {children}
            </StatusManageProvider>
          </MyApolloProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
