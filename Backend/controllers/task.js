const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Task = require("../model/Task");

async function getAllTasks(req, res) {
  const { userId, name } = req.user;
  const tasks = await Task.find({ createdBy: userId }).sort({
    completed: 1,
    updatedAt: -1,
    createdAt: 1,
  });
  res.status(StatusCodes.OK).json({ tasks, name });
}

async function createTask(req, res) {
  const { userId } = req.user;
  const { name } = req.body;
  const task = await Task.create({ name: name, createdBy: userId });
  res.status(StatusCodes.CREATED).json({ task });
}

async function getTask(req, res) {
  const { id: taskID } = req.params;
  const { userId, name } = req.user;
  const task = await Task.findOne({ _id: taskID, createdBy: userId });
  if (!task) {
    throw new NotFoundError(`No task with id of ${taskID}`);
  }
  res.status(StatusCodes.OK).json({ task, name });
}

async function updateTask(req, res) {
  const { id: taskID } = req.params;
  const { name: newName, completed: status } = req.body;
  const { userId, name } = req.user;
  const task = await Task.findOneAndUpdate(
    { _id: taskID, createdBy: userId },
    { name: newName, completed: status },
    { runValidators: true, new: true }
  );
  if (!task) {
    throw new NotFoundError(`No task with id of ${taskID}`);
  }
  res.status(StatusCodes.OK).json({ name });
}

async function deleteTask(req, res) {
  const { id: taskID } = req.params;
  const { userId } = req.user;
  const task = await Task.findOneAndDelete({ _id: taskID, createdBy: userId });
  if (!task) {
    throw new NotFoundError(`No task with id of ${taskID}`);
  }
  res.status(StatusCodes.OK).json({ task });
}

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
