import { Component, forwardRef, HostListener, Inject, OnInit } from '@angular/core';
import { Application } from '../../models/application';
import * as data from '../../../assets/svenska-ord.json';
import { WindowComponent } from '../../window/window.component';

@Component({
    selector: 'sandstrom-projects-ordle',
    templateUrl: './ordle.component.html',
    styleUrls: ['./ordle.component.scss'],
})
export class OrdleComponent extends Application implements OnInit {
    name = 'Ordle';
    icon = 'title';
    guesses = ['','','','','',''];
    currentGuessIndex = 0;
    words: string[] = [];
    hiddenWord = 'altan';
    evaluation: string[][] = [['tbd', 'tbd', 'tbd', 'tbd', 'tbd'], ['tbd', 'tbd', 'tbd', 'tbd', 'tbd'], ['tbd', 'tbd', 'tbd', 'tbd', 'tbd'], ['tbd', 'tbd', 'tbd', 'tbd', 'tbd'], ['tbd', 'tbd', 'tbd', 'tbd', 'tbd'], ['tbd', 'tbd', 'tbd', 'tbd', 'tbd']];
    gameEnded = false;
    @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
        if(this.gameEnded) {
            return;
        }

        if(event.key.match(/^[a-zåäö]+$/i) && event.key.length === 1 && this.currentGuess.length < 5) { // valid letters
            this.guesses[this.currentGuessIndex] += event.key;
        }

        if(event.key === 'Enter' && this.guesses[this.currentGuessIndex].length === 5) {
            this.validateGuess();

        }

        if(event.key === 'Backspace' && this.guesses[this.currentGuessIndex].length > 0) { 
            this.guesses[this.currentGuessIndex] = this.guesses[this.currentGuessIndex].slice(0, -1);
        }
    }

    constructor(@Inject(forwardRef(() => WindowComponent)) private window: WindowComponent) {
        super();
    }

    ngOnInit(): void {
        this.window.windowMinHeight = 500;
        this.window.windowMinWidth = 400;
        this.window.setPosition(50, 50);
        const json = JSON.stringify(data);
        const words: { [key: string]: string } = JSON.parse(json);

        for (const key in words) {
            if (words[key].length === 5 && words[key].match(/^[a-zåäö]+$/i)) {
                this.words.push(words[key]);
            }
        }
        //words.filter(key => )
    }

    get createArrayOfLength() {
        return Array.from(Array(5).keys());
    }

    get currentGuess() {
        return this.guesses[this.currentGuessIndex];
    }

    validateGuess() {
        const guess = this.currentGuess.toLocaleLowerCase();
        const valid = !!this.words.find(word => word === guess);
        if(valid) {
            

            for(const i of this.createArrayOfLength) {
                const char = this.currentGuess[i];
                if(char === this.hiddenWord[i]) {
                    this.evaluation[this.currentGuessIndex][i] = 'correct';
                    continue;
                }


                if(this.hiddenWord.split(this.currentGuess[i]).length - 1) {
                    this.evaluation[this.currentGuessIndex][i] = 'present';
                    continue;
                }
                
                this.evaluation[this.currentGuessIndex][i] = 'absent';
            }

            if(this.guesses[this.currentGuessIndex] === this.hiddenWord) { //LOOk if word is correct first;
                console.log('correct guess');
                this.gameEnded = true;
                return;
            }

            this.currentGuessIndex++;

            
        } else {
            console.log('Not valid')
        }
    }
}
