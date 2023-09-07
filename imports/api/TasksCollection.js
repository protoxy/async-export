import {Mongo} from "meteor/mongo";

/**
 * One or multiple async export tasks
 */
export const TasksCollection = new Mongo.Collection('tasks');