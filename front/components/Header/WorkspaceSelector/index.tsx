import { useReactiveVar } from "@apollo/client";
import cn from "classnames";
import { useEffect, useState, VFC } from "react";
import { useMeQuery, WorkspaceUser } from "../../../generated/graphql";
import { currentWorkspaceVar, loggedInVar } from "../../../vars";
import styles from "./index.module.css";

export const WorkspaceSelector: VFC<{ className?: string }> = ({
  className = "",
}) => {
  const loggedIn = useReactiveVar(loggedInVar);
  const meRes = useMeQuery({ skip: !loggedIn });
  const workspaceUser = useReactiveVar(currentWorkspaceVar);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpened(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn(className, styles.workspaceSelector)}>
      <div
        className={styles.workspaceSelected}
        onClick={(e) => {
          setIsOpened((b) => !b);
          e.stopPropagation();
        }}
      >
        {workspaceUser?.workspace.code || "unselected"}
      </div>
      {
        isOpened && (
          <div
            className={styles.workspaceList}
            onClick={(e) => e.stopPropagation()}
          >
            {
              meRes.data?.me.workspaces.map((w) => {
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
              })
            }
          </div>
        )
      }
    </div>
  );
};
