"use client";

import { useContext, useEffect, useState } from "react";
import { useCreateUserMutation, useMeQuery } from "../../generated/graphql";
import { AuthContext } from "../../context/auth";
import { useRouter } from "next/navigation";

export default function CreateUser() {
  const [userName, setUserName] = useState("");
  const { currentUser } = useContext(AuthContext)
  const [createUser] = useCreateUserMutation();
  const router = useRouter();

  const meRes = useMeQuery();

  useEffect(() => {
    if (meRes.data?.me)
      router.push("/");
  }, [meRes.data?.me])

  const submit = async () => {
    if (!currentUser) return
    await createUser({ variables: { name: userName } })
  }

  return (
    <div>
      create user
      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <button onClick={submit}>create</button>
    </div>
  )
}
