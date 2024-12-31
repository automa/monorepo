import botInstallationScheduled from './botInstallationScheduled';
import botScheduled from './botScheduled';
import botScheduleTriggered from './botScheduleTriggered';
import taskCreated from './taskCreated';
import taskScheduled from './taskScheduled';

const queues = {
  botInstallationScheduled,
  botScheduled,
  botScheduleTriggered,
  taskCreated,
  taskScheduled,
};

export default queues;
