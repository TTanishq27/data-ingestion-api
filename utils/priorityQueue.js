class PriorityQueue {
  constructor() {
    this.queues = {
      HIGH: [],
      MEDIUM: [],
      LOW: [],
    };
  }

  enqueue(item, priority) {
    this.queues[priority].push(item);
  }

  dequeue() {
    for (const level of ["HIGH", "MEDIUM", "LOW"]) {
      if (this.queues[level].length) {
        return this.queues[level].shift();
      }
    }
    return null;
  }

  isEmpty() {
    return (
      !this.queues.HIGH.length &&
      !this.queues.MEDIUM.length &&
      !this.queues.LOW.length
    );
  }
}

module.exports = PriorityQueue;
