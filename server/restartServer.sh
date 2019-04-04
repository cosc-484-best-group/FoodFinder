#!/bin/bash
screen -X -S node quit;
screen -d -m -S node 
screen -X -S node stuff 'node ~/Github/FoodFinder app.js 2>&1 | tee -a ~/logs/$(date +"%F+%H:%M:%S+%N").log';
