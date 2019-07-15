const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String
});
const Task = mongoose.model('task', taskSchema);

const allTaskSchema = new Schema({
    user_email: String,
    task_id: {
        ref: 'task',
        type: Schema.Types.ObjectId
    }

});
const AllTask = mongoose.model('alltask', allTaskSchema);

module.exports = {
    Task,
    AllTask
};

