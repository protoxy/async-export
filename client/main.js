import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './main.html';

let interval;
const links = [
    'https://www.lempire.com/',
    'https://www.lemlist.com/',
    'https://www.lemverse.com/',
    'https://www.lemstash.com/'
];

Template.mainContainer.onCreated(() => {
    this.link = new ReactiveVar(links[Math.floor(Math.random() * links.length)]);
    this.progress = new ReactiveVar(0);
});

Template.mainContainer.helpers({
    isInitial: () => getProgress() === 0,
    isComplete: () => getProgress() >= 100,
    isInProgress: () => getProgress() !== 0 && getProgress() < 100,
    isDisplayProgress: () => !!getProgress() && getProgress() !== 0,
    progress: () => getProgress(),
    randomLink: () => this.link.get()
});

Template.mainContainer.events({
    'click .start-export-button': () => simulate(),
    'click .reset-export-button': () => reset(),
});

function getProgress() {
    return this.progress.get();
}

function simulate() {
    try {
        let p = this.progress.get();
        interval = setInterval(() => {
            this.progress.set(p += 5);
            if (p >= 100) {
                clearInterval(interval);
            }
        }, 1000);
    } catch (e) {
        clearInterval(interval);
        throw new Error(e);
    }
}

function reset() {
    this.progress.set(0)
    clearInterval(interval);
}
