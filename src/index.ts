import os from "os";
import { getPackageInfos } from "./monorepo/getPackageInfos";
import { injectCacheTaskDepsMap, getCacheTaskIds } from "./cache/cacheTasks";
import { RunContext } from "./types/RunContext";
import { discoverTaskDeps } from "./task/discoverTaskDeps";
import { getSortedTaskIds } from "./task/getSortedTaskIds";
import { runTasks } from "./task/taskRunner";

const context: RunContext = {
  allPackages: getPackageInfos(process.cwd()),
  command: "bulid",
  concurrency: os.cpus().length - 1,
  defaultPipeline: {
    clean: [],
    rebuild: ["clean", "build"],
    build: ["^build"],
    ut: ["build"],
  },
  taskDepsMap: new Map(),
  tasks: new Map(),
  packageScope: [],
  measures: [],
};

injectCacheTaskDepsMap(context);
discoverTaskDeps(context);

const sortedTaskIds = getSortedTaskIds(context);

sortedTaskIds.splice(0, 0, getCacheTaskIds(context));

runTasks(sortedTaskIds, context);
