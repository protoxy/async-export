import {Meteor} from 'meteor/meteor';
import {ExportsCollection} from '/imports/api/ExportsCollection';
import {TasksCollection} from "../imports/api/TasksCollection";

Meteor.startup(() => {
    /**
     * populate database with Exports (links) and tasks (progress) of 0 progress
     */
    if (ExportsCollection.find().count() === 0) {
        [
            {link: `https://www.lempire.com/`},
            {link: 'https://www.lemlist.com/'},
            {link: 'https://www.lemverse.com/'},
            {link: 'https://www.lemstash.com/'},
        ].forEach(obj => ExportsCollection.insert(obj))
    }
    if (TasksCollection.find().count() === 0) {
        TasksCollection.insert({progress: 0});
    }
});

Meteor.methods({
    /**
     * Picks a random link from database
     * @returns a random link
     */
    pickOneLink: () => {
        const cols = ExportsCollection.find({}).fetch();
        return cols[Math.floor(Math.random() * cols.length)]?.link;
    },
    /**
     * @returns the progress from database
     */
    getProgress: () => TasksCollection.find({}).fetch()[0]?.progress || 0,
    /**
     * Updates the progress
     */
    updateProgress: (progress) => {
        const task = TasksCollection.find({}).fetch()[0];
        TasksCollection.update(task._id, {
            $set: {progress: progress},
        });
    }
});