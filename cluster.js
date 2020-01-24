const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpus = os.cpus().length;
  // eslint-disable-next-line no-console
  console.log(`Forking for ${cpus} CPUs`);

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    // eslint-disable-next-line no-console
    console.log(`Yay, the worker ${worker.id} responded after it was forked`);
  });

  // restart worker if it was crushed for some causes
  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      // eslint-disable-next-line no-console
      console.log(`Worker ${worker.id} crashed. ` + 'Starting a new worker...');
      cluster.fork();
    }
  });

  const counter = function() {
    this.count = this.count || 5;
    this.count = this.count + 10;
    return this.count;
  };
  const updateWorkers = async () => {
    const count = counter();

    Object.values(cluster.workers).forEach(worker => {
      worker.send({ count, id: worker.id });
    });
  };
  updateWorkers();
  setInterval(updateWorkers, 10000);
} else {
  require('./server');
}
