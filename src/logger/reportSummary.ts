import { RunContext } from "../types/RunContext";
import { getPackageTaskFromId } from "../task/taskId";
import log from "npmlog";
import { formatDuration } from "./formatDuration";

function hr() {
  console.log("----------------------------------------------");
}

export async function reportSummary(context: RunContext) {
  const { command, measures, taskLogs } = context;

  hr();

  if (measures.failedTask) {
    const [pkg, task] = getPackageTaskFromId(measures.failedTask);
    log.error("", `ERROR DETECTED IN ${pkg} ${task}`);
    log.error("", taskLogs.get(measures.failedTask)!.join("\n"));

    hr();
  }

  log.info(
    "",
    measures.taskStats
      .map((stats) => {
        const [pkg, task] = getPackageTaskFromId(stats.taskId);
        return `[${pkg} - ${task}] took ${formatDuration(stats.duration)}s`;
      })
      .join("\n")
  );

  hr();

  log.info(
    "",
    `The command "${command}" took a total of ${formatDuration(
      measures.duration
    )}s to complete`
  );
}
