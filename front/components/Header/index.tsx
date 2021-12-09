import firebase from "firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, VFC } from "react";
import { AuthContext } from "../../context/auth";
import { useCreateUserMutation, useMeQuery } from "../../generated/graphql";
import { WorkspaceSelector } from "./WorkspaceSelector";

import cn from "classnames";

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

  return (
    <div className={cn("p-2 flex select-none", className)}>
      {currentUser ? (
        <>
          <div className="px-2">
            <Link href="/">ALP</Link>
          </div>
          <WorkspaceSelector />
          <div className="flex-auto"></div>
          <div className="cursor-pointer" onClick={() => router.push("/me")}>
            {currentUser?.displayName}
          </div>
          <div
            className="ml-6 cursor-pointer"
            onClick={() => firebase.auth().signOut()}
          >
            sign out
          </div>
        </>
      ) : (
        <div>
          please <Link href="/signin">sign in</Link>
        </div>
      )}
    </div>
  );
};
