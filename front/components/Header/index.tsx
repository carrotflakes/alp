"use client";

import Link from "next/link";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth";
import { useCreateUserMutation, useMeQuery } from "../../generated/graphql";
import { WorkspaceSelector } from "./WorkspaceSelector";

import cn from "classnames";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/navigation";

export const Header = ({ className = "" }: { className?: string }) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  return (
    <div className={cn("p-2 flex select-none", className)}>
      {currentUser ? (
        <>
          <div className="px-2 text-xl">
            <Link href="/">ALP</Link>
          </div>
          <WorkspaceSelector />
          <div className="flex-auto"></div>
          <div className="cursor-pointer" onClick={() => router.push("/me")}>
            {currentUser?.displayName}
          </div>
          <div
            className="ml-6 cursor-pointer"
            onClick={() => auth.signOut()}
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
