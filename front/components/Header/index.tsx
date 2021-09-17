import { useContext, useEffect, VFC } from "react";
import { AuthContext } from "../../context/auth";
import { useCreateUserMutation, useMeQuery } from "../../generated/graphql";
import firebase from "firebase";
import Link from "next/link";

export const Header: VFC<{ className?: string }> = ({ className = "" }) => {
  const { currentUser } = useContext(AuthContext);

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
          signed in as {currentUser?.displayName}
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
