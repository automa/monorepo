import botInstallationScheduled from './botInstallationScheduled';
import botScheduled from './botScheduled';
import botScheduleJob from './botScheduleJob';
import taskCreated from './taskCreated';
import taskScheduled from './taskScheduled';

const queues = {
  botInstallationScheduled,
  botScheduled,
  botScheduleJob,
  taskCreated,
  taskScheduled,
};

export default queues;
