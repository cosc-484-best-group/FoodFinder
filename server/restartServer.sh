#!/bin/bash
screen -X -S node quit;
screen -d -m -S node 
screen -X -S node stuff 'node ~/Github/FoodFinder app.js\n';
