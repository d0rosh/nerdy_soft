const Profile = require('../models/profile');
const { Task, AllTask } = require('../models/task');

module.exports = {
  updateTask: async email => {
    const result = await AllTask.find({ user_email: email });
    const ids = result.map(obj => {
      return obj.task_id;
    });
    const tasks = await Task.find({ _id: { $in: ids } });
    return tasks;
  },
  getTasks: async (req, res, next) => {
    const tasks_ids = await AllTask.find({ user_email: req.user.email });
    const ids = tasks_ids.map(obj => {
      return obj.task_id;
    });
    let emails = await AllTask.find({ task_id: { $in: ids } });
    emails = emails.filter(obj => {
      return obj.user_email != req.user.email;
    });
    const tasks = await Task.find({ _id: { $in: ids } });

    // const result = tasks.reduce((acc, task, index) => {
    //   let cloned = { ...task, emails: [] };

    //   console.log('Task', cloned);

    //   emails.forEach(data => {
    //     if (data.task_id === cloned._id) {
    //       cloned.emails.push(data.user_email);
    //     }
    //   });
    //   acc[index] = cloned;
    //   return acc;
    // }, []);

    try {
      res.status(200).json({ tasks, emails });
    } catch (e) {
      next(e);
    }
  },
  setTask: async (req, res, next) => {
    const task = new Task(req.body);

    try {
      await task.save();

      const jointTask = new AllTask({
        user_email: req.user.email,
        task_id: task._id
      });
      await jointTask.save();
      res.status(201).json(task);
    } catch (e) {
      next(e);
    }
  },
  editTask: async (req, res, next) => {
    try {
      await Task.findOneAndUpdate(
        { _id: req.body._id },
        { $set: { name: req.body.name } }
      );

      res.status(204).json({
        message: 'Successsuccessfully updated!'
      });
    } catch (e) {
      next(e);
    }
  },
  deleteTask: async (req, res, next) => {
    const task = await Task.findOne({ _id: req.params.id });
    try {
      await Task.deleteOne({ _id: task._id });
      await AllTask.deleteMany({ task_id: task._id }, function(err) {
        console.log(err);
      });
      res.status(201).json({
        message: 'Successsuccessfully deleted!'
      });
    } catch (e) {
      next(e);
    }
  },
  shareTask: async (req, res, next) => {
    const tasks = await AllTask.findOne({
      user_email: req.body.email,
      task_id: req.body.id
    });

    try {
      let message;
      if (!tasks) {
        const shareTask = new AllTask({
          user_email: req.body.email,
          task_id: req.body.id
        });
        await shareTask.save();
        message = 'Successsuccessfully shared!';
      } else {
        message = 'This user already has a task!';
      }

      res.status(201).json({ message });
    } catch (e) {
      next(e);
    }
  }
};
