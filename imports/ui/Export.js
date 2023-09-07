import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor'
import './Export.html';

let interval;
const PROGRESS = 'progress';
const LINK = 'link';
const state = new ReactiveDict();

Template.mainContainer.onCreated(() => {
    // Pick a random link from db (could also be called when export is resolved)
    Meteor.call('pickOneLink', (error, link) => state.setDefault(LINK, link));
    // Get progress stored in db in case of refresh
    Meteor.call('getProgress', (error, p) => state.setDefault(PROGRESS, p));
});

Template.mainContainer.onRendered(() => resume());

Template.mainContainer.helpers({
    isInitial: () => getProgress() === 0,
    isComplete: () => getProgress() >= 100,
    isInProgress: () => getProgress() !== 0 && getProgress() < 100,
    isDisplayProgress: () => !!getProgress() && getProgress() !== 0,
    progress: () => getProgress(),
    randomLink: () => state.get(LINK)
});

Template.mainContainer.events({
    'click .start-export-button': async () => await simulate(),
    'click .reset-export-button': () => reset(),
});

/**
 * gets the most recent progress value
 * @returns progress value
 */
function getProgress() {
    return state.get(PROGRESS);
}

/**
 * updates progress value
 * @param p new progress value
 */
function updateProgress(p) {
    Meteor.call('updateProgress', p, (err, res) => {
        if (err) {
            throw new Error(err);
        } else {
            state.set(PROGRESS, p);
        }
    });
}

/**
 * resumes progress in case browser refreshed
 */
function resume() {
    setTimeout(() => {
        if (getProgress() !== 0 && getProgress() < 100) {
            simulate();
        }
    }, 500);
}

/**
 * simulates export progress
 */
async function simulate() {
    interval && clearInterval(interval);
    return new Promise((resolve, reject) => {
        try {
            let p = getProgress();
            interval = setInterval(() => {
                updateProgress(p += 5);
                if (p >= 100) {
                    clearInterval(interval);
                    resolve(p);
                }
            }, 1000);
        } catch (e) {
            clearInterval(interval);
            reject(e);
        }
    });
}

/**
 * resets the page to the initial state
 */
function reset() {
    updateProgress(0);
    clearInterval(interval);
}

