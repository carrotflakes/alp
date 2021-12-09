import { useReactiveVar } from "@apollo/client";
import { useState, VFC } from "react";
import { useMeQuery, WorkspaceUser } from "../../../generated/graphql";
import { currentWorkspaceVar, loggedInVar } from "../../../vars";
import styles from "./index.module.css";
import cn from "classnames";

export const WorkspaceSelector: VFC<{ className?: string }> = ({
  className = "",
}) => {
  const loggedIn = useReactiveVar(loggedInVar);
  const meRes = useMeQuery({ skip: !loggedIn });
  const workspaceUser = useReactiveVar(currentWorkspaceVar);
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className={cn(className, styles.workspaceSelector)}>
      <div
        className={styles.workspaceSelected}
        onClick={() => setIsOpened((b) => !b)}
      >
        {workspaceUser?.workspace.code || "unselected"}
      </div>
      {isOpened && (
        <div className={styles.workspaceList}>
          {meRes.data?.me.workspaces.map((w) => {
            return (
              <div
                key={w.workspace.id}
                onClick={() => {
                  currentWorkspaceVar(w as WorkspaceUser);
                  setIsOpened(false);
                }}
              >
                <div className={styles.workspaceListItem}>
                  {w.workspace.code}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
