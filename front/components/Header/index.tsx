import firebase from "firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, VFC } from "react";
import { AuthContext } from "../../context/auth";
import { useCreateUserMutation, useMeQuery } from "../../generated/graphql";
import { WorkspaceSelector } from "./WorkspaceSelector";

export const Header: VFC<{ className?: string }> = ({ className = "" }) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  const meRes = useMeQuery();
  const [createUser] = useCreateUserMutation({
    onCompleted: () => {
      meRes.refetch();
    },
  });

  useEffect(() => {
    if (currentUser && meRes.error?.message === "user not found") {
      createUser({ variables: { name: currentUser.email || "NONAME" } });
    }
  }, [currentUser, meRes]);

  if (currentUser && meRes.error) {
    return <div>Error {meRes.error.message}</div>;
  }
  return (
    <div className={className + " p-2"}>
      {currentUser ? (
        <div>
          <WorkspaceSelector />
          &nbsp;
          signed in as{" "}
          <span onClick={() => router.push("/me")}>
            {currentUser?.displayName}
          </span>
          <span className="ml-6" onClick={() => firebase.auth().signOut()}>
            sign out
          </span>
        </div>
      ) : (
        <div>
          please <Link href="/signin">sign in</Link>
        </div>
      )}
    </div>
  );
};
